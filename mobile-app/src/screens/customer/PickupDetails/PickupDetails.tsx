import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Ionicons } from '@expo/vector-icons';
import { useApiData } from '../../../hooks/useApiData';
import { pickupService } from '../../../services/pickup.service';
import { customerService } from '../../../services/customer.service';

const fmtTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Pending';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Awaiting Collector Assignment',
  assigned: 'Confirmed & Scheduled',
  in_progress: 'Collector En Route',
  completed: 'Completed & Verified',
  cancelled: 'Cancelled',
};

export const CustomerPickupDetails: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const pickupId: string = route?.params?.pickupId;
  const { data, error, reload } = useApiData(
    () => Promise.all([pickupService.getPickup(pickupId), customerService.materialRates()]),
    [pickupId]
  );
  const [cancelling, setCancelling] = useState(false);
  const [pickup, rates] = data || [null, []];
  const p = pickup as any;

  const timelineSteps = p
    ? [
        { title: 'Request Created', time: fmtTime(p.createdAt), done: true },
        { title: p.pickerName ? `Collector Assigned (${p.pickerName})` : 'Collector Assignment', time: fmtTime(p.assignedAt), done: !!p.assignedAt && !!p.pickerName },
        { title: 'En Route to Doorstep', time: p.acceptedAt ? fmtTime(p.acceptedAt) : `${p.scheduledDate} · ${p.scheduledTimeSlot}`, done: !!p.acceptedAt },
        { title: 'Digital Weight Verification', time: p.completedAt ? `${fmtTime(p.completedAt)} · ${p.totalActualWeight} kg` : 'Pending', done: p.status === 'completed' },
      ]
    : [];

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await pickupService.cancel(pickupId);
      await reload();
    } catch (e) {
      Alert.alert('Cannot cancel', (e as Error).message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title={`Pickup ${pickupId}`} subtitle="Request tracking & item breakdown" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        {error && <Text style={{ color: '#DC2626', marginBottom: 12 }}>⚠️ {error}</Text>}
        {p && (
          <>
            <View style={styles.statusHeroCard}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeTxt}>● {STATUS_LABEL[p.status] || p.status}</Text>
              </View>
              <Text style={styles.timeSlotTxt}>{p.scheduledDate} · {p.scheduledTimeSlot}</Text>
              <Text style={styles.addressTxt}>📍 {p.address.street}, {p.address.city}</Text>
              {p.rejectionReason && p.status === 'pending' && (
                <Text style={[styles.addressTxt, { color: '#B45309' }]}>Reassigning collector: {p.rejectionReason}</Text>
              )}
            </View>

            <View style={styles.sectionHeaderRow}>
              <View style={styles.titleGroup}>
                <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
                <Text style={styles.sectionTitle}>Status Timeline</Text>
              </View>
            </View>

            <Card style={styles.timelineCard}>
              {timelineSteps.map((step, idx) => (
                <View key={idx} style={styles.timelineRow}>
                  <View style={styles.timelineIndicator}>
                    <View style={[styles.dotCircle, step.done ? styles.dotDone : styles.dotPending]}>
                      {step.done && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    {idx < timelineSteps.length - 1 && (
                      <View style={[styles.timelineLine, step.done ? styles.lineDone : styles.linePending]} />
                    )}
                  </View>
                  <View style={{ flex: 1, paddingBottom: idx === timelineSteps.length - 1 ? 0 : 20 }}>
                    <Text style={[styles.timelineStepTitle, { color: step.done ? '#0F172A' : '#94A3B8' }]}>{step.title}</Text>
                    <Text style={styles.timelineStepTime}>{step.time}</Text>
                  </View>
                </View>
              ))}
            </Card>

            <View style={styles.sectionHeaderRow}>
              <View style={styles.titleGroup}>
                <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
                <Text style={styles.sectionTitle}>Declared Waste Items</Text>
              </View>
            </View>

            <Card style={styles.itemsCard}>
              {p.items.map((it: any) => {
                const rate = rates.find((r) => r.category === it.category);
                const kg = it.actualWeightKg ?? it.estimatedWeightKg;
                return (
                  <View key={it.category} style={styles.itemRow}>
                    <Text style={{ fontSize: 22, marginRight: 10 }}>{rate?.icon || '♻️'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{rate?.materialName || it.category}</Text>
                      <Text style={styles.itemSub}>{it.actualWeightKg !== undefined ? `Verified: ${kg} kg` : `Est: ~${kg} kg`}</Text>
                    </View>
                    <Text style={styles.itemPoints}>+{Math.round(kg * (rate?.pointsPerKg || 0))} pts</Text>
                  </View>
                );
              })}
            </Card>

            {['pending', 'assigned'].includes(p.status) && (
              <TouchableOpacity style={[styles.trackBtn, { backgroundColor: '#FEF2F2' }]} onPress={handleCancel} disabled={cancelling}>
                <Text style={[styles.trackBtnTxt, { color: '#DC2626' }]}>{cancelling ? 'Cancelling…' : '✖ Cancel Pickup Request'}</Text>
              </TouchableOpacity>
            )}
            {p.status === 'in_progress' && (
              <TouchableOpacity style={styles.trackBtn} onPress={() => navigation.navigate('CustomerTracking', { pickupId })}>
                <Text style={styles.trackBtnTxt}>📍 Track Collector Live</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  contentContainer: {
    paddingBottom: 40
  },
  body: {
    padding: 20
  },
  statusHeroCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 24
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  statusBadgeTxt: {
    fontSize: 12,
    fontWeight: '900',
    color: '#059669'
  },
  timeSlotTxt: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  addressTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
    marginTop: 6
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  titleAccentBar: {
    width: 4,
    height: 18,
    borderRadius: 2
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 14
  },
  timelineIndicator: {
    alignItems: 'center'
  },
  dotCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotDone: {
    backgroundColor: '#10B981'
  },
  dotPending: {
    backgroundColor: '#E2E8F0'
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4
  },
  lineDone: {
    backgroundColor: '#10B981'
  },
  linePending: {
    backgroundColor: '#F1F5F9'
  },
  timelineStepTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  timelineStepTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  itemSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1
  },
  itemPoints: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D97706'
  },
  trackBtn: {
    backgroundColor: '#10B981',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trackBtnTxt: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF'
  }
});
