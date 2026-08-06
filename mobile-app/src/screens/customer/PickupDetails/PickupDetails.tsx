import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Ionicons } from '@expo/vector-icons';

export const CustomerPickupDetails: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const pickupId = route?.params?.pickupId || 'PU-1024';

  const timelineSteps = [
    { title: 'Request Created', time: 'Aug 05, 08:30 AM', done: true },
    { title: 'Collector Assigned (Suresh K.)', time: 'Aug 05, 09:15 AM', done: true },
    { title: 'En Route to Doorstep', time: 'Tomorrow, 08:00 AM', done: false },
    { title: 'Digital Weight Verification', time: 'Pending', done: false }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title={`Pickup ${pickupId}`} subtitle="Request tracking & item breakdown" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        {/* Status Card */}
        <View style={styles.statusHeroCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeTxt}>● Confirmed & Scheduled</Text>
          </View>

          <Text style={styles.timeSlotTxt}>Tomorrow, 08:00 AM - 10:00 AM</Text>
          <Text style={styles.addressTxt}>📍 45 Ward Place, Colombo 07</Text>
        </View>

        {/* Status Timeline */}
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

        {/* Items Breakdown */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.sectionTitle}>Declared Waste Items</Text>
          </View>
        </View>

        <Card style={styles.itemsCard}>
          <View style={styles.itemRow}>
            <Text style={{ fontSize: 22, marginRight: 10 }}>🧴</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Plastic Bottles (PET)</Text>
              <Text style={styles.itemSub}>Est: ~3.0 kg</Text>
            </View>
            <Text style={styles.itemPoints}>+150 pts</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={{ fontSize: 22, marginRight: 10 }}>📰</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Paper & Cardboard</Text>
              <Text style={styles.itemSub}>Est: ~5.0 kg</Text>
            </View>
            <Text style={styles.itemPoints}>+150 pts</Text>
          </View>
        </Card>

        {/* Action Button */}
        <TouchableOpacity style={styles.trackBtn} onPress={() => navigation.navigate('CustomerTracking')}>
          <Text style={styles.trackBtnTxt}>📍 Track Collector Live</Text>
        </TouchableOpacity>
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
