import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, RefreshControl, ActivityIndicator } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Ionicons } from '@expo/vector-icons';
import { pickupService } from '../../../services/pickup.service';
import { customerService } from '../../../services/customer.service';

const fmtTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Pending';

export const CustomerTracking: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const [pickup, setPickup] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [etaMins, setEtaMins] = useState(12);

  const pickupId = route?.params?.pickupId;

  const loadTrackingData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      let targetId = pickupId;
      if (!targetId) {
        const dash = await customerService.dashboard();
        targetId = dash.nextPickup?.id;
      }
      if (targetId) {
        const p = await pickupService.getPickup(targetId);
        setPickup(p);
      } else {
        setPickup(null);
      }
    } catch (err) {
      console.warn('Failed to load tracking pickup:', err);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrackingData();
    const timer = setInterval(() => {
      loadTrackingData(true);
      setEtaMins((prev) => Math.max(3, prev - 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [pickupId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTrackingData();
  };

  const handleCallDriver = (phone?: string) => {
    const p = phone || pickup?.pickerPhone || '+94719876543';
    Linking.openURL(`tel:${p}`);
  };

  const isAssigned = pickup?.status === 'assigned' || pickup?.status === 'in_progress' || pickup?.status === 'completed';
  const isEnRoute = pickup?.status === 'in_progress';
  const isCompleted = pickup?.status === 'completed';
  const isPending = !pickup || pickup.status === 'pending';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
    >
      <Header
        title="Live GPS Tracking 📍"
        subtitle={pickup ? `Pickup ${pickup.id} · Doorstep Dispatch` : 'Real-time eco-collector location'}
        showBack
        onBackPress={() => navigation.goBack()}
        greenTheme
      />

      <View style={styles.body}>
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={{ marginTop: 12, color: '#64748B', fontWeight: '600' }}>Connecting to Live Dispatch...</Text>
          </View>
        ) : isPending ? (
          <Card style={styles.pendingCard}>
            <View style={styles.radarIconBg}>
              <Text style={{ fontSize: 36 }}>📡</Text>
            </View>
            <Text style={styles.pendingTitle}>Awaiting Collector Allocation</Text>
            <Text style={styles.pendingSub}>
              {pickup
                ? `Your request (${pickup.id}) is in the Admin Dispatch queue. An eco-collector driver will be assigned shortly.`
                : 'No active pickup requests found. Schedule a collection to start tracking!'}
            </Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={() => loadTrackingData()}>
              <Text style={styles.refreshBtnTxt}>🔄 Check Dispatch Status</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            {/* Interactive Simulation Map Canvas */}
            <View style={styles.mapContainer}>
              <View style={styles.mapGridLines}>
                <View style={styles.roadLineH} />
                <View style={styles.roadLineV} />
                <View style={styles.roadDiagonal} />
              </View>

              {/* Destination Doorstep Pin */}
              <View style={styles.doorstepPin}>
                <View style={styles.pinBubble}>
                  <Text style={styles.pinBubbleTxt}>🏠 Doorstep</Text>
                </View>
                <Text style={{ fontSize: 26 }}>📍</Text>
              </View>

              {/* Live Moving Truck Icon */}
              <View style={[styles.movingTruck, { top: isCompleted ? 85 : 55, left: isCompleted ? 180 : 110 }]}>
                <View style={styles.truckPulse} />
                <View style={styles.truckIconBg}>
                  <Text style={{ fontSize: 22 }}>🚛</Text>
                </View>
              </View>

              {/* Status Header Badge */}
              <View style={styles.mapOverlayHeader}>
                <View style={styles.liveBadgeRow}>
                  <View style={[styles.liveDot, { backgroundColor: isCompleted ? '#10B981' : '#0284C7' }]} />
                  <Text style={styles.liveStatusTxt}>
                    {isCompleted ? 'Collection Completed' : isEnRoute ? 'Driver En Route' : 'Driver Assigned'}
                  </Text>
                </View>
                <Text style={styles.mapEtaTxt}>
                  {isCompleted ? 'Completed & Verified ✓' : `ETA: ~${etaMins} mins · 1.8 km away`}
                </Text>
              </View>
            </View>

            {/* Assigned Driver Card */}
            <Card style={styles.driverCard}>
              <View style={styles.driverRow}>
                <View style={styles.driverAvatar}>
                  <Text style={{ fontSize: 24 }}>👨‍✈️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{pickup.pickerName || 'Assigned Collector'}</Text>
                  <Text style={styles.vehicleNo}>
                    Vehicle: {pickup.pickerVehicleNumber || 'WP-5842'} ({pickup.pickerVehicleType || 'Eco-Truck'})
                  </Text>
                  <Text style={styles.rating}>
                    ⭐ {pickup.pickerRating ? Number(pickup.pickerRating).toFixed(1) : '5.0'} · Verified Collector
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => handleCallDriver(pickup.pickerPhone)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Card>

            {/* Status Timeline */}
            <View style={styles.sectionHeader}>
              <View style={styles.titleGroup}>
                <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
                <Text style={styles.sectionTitle}>Real-time Collection Pipeline</Text>
              </View>
            </View>

            <Card style={styles.timelineCard}>
              {[
                { step: 'Request Confirmed by Customer', time: fmtTime(pickup.createdAt), done: true },
                {
                  step: `Collector Assigned (${pickup.pickerName || 'Pending'})`,
                  time: pickup.assignedAt ? fmtTime(pickup.assignedAt) : 'Pending Dispatch',
                  done: isAssigned
                },
                {
                  step: 'Collector En Route to Your Address',
                  time: pickup.acceptedAt ? fmtTime(pickup.acceptedAt) : isEnRoute ? 'En Route' : 'Scheduled',
                  done: isEnRoute || isCompleted
                },
                {
                  step: isCompleted
                    ? `Doorstep Weigh-in: ${pickup.totalActualWeight || pickup.totalEstimatedWeight} kg Verified`
                    : 'Doorstep Weight Measurement & Photo Verification',
                  time: isCompleted && pickup.completedAt ? fmtTime(pickup.completedAt) : 'At Doorstep',
                  done: isCompleted
                },
                {
                  step: isCompleted
                    ? `+${pickup.earnedPoints || pickup.estimatedPoints} Eco Points Credited to Wallet!`
                    : 'Eco Points Credited to Wallet',
                  time: isCompleted ? 'Completed' : 'After Weigh-in',
                  done: isCompleted
                }
              ].map((item, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={[styles.dot, item.done && styles.dotDone]}>
                    {item.done && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.timelineTxt, item.done && styles.txtDone]}>{item.step}</Text>
                    <Text style={styles.timelineTime}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </Card>
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
  body: {
    padding: 16
  },
  pendingCard: {
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 20
  },
  radarIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  pendingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8
  },
  pendingSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  refreshBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12
  },
  refreshBtnTxt: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  mapContainer: {
    height: 220,
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD'
  },
  mapGridLines: {
    ...StyleSheet.absoluteFill
  },
  roadLineH: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#FFFFFF',
    opacity: 0.8
  },
  roadLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 170,
    width: 14,
    backgroundColor: '#FFFFFF',
    opacity: 0.8
  },
  roadDiagonal: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 220,
    height: 8,
    backgroundColor: '#93C5FD',
    transform: [{ rotate: '25deg' }]
  },
  doorstepPin: {
    position: 'absolute',
    bottom: 25,
    right: 35,
    alignItems: 'center'
  },
  pinBubble: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 2
  },
  pinBubbleTxt: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  movingTruck: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  truckPulse: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#38BDF8',
    opacity: 0.4
  },
  truckIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  mapOverlayHeader: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  liveStatusTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A'
  },
  mapEtaTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7'
  },
  driverCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0'
  },
  driverName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  vehicleNo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  rating: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '700',
    marginTop: 2
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  sectionHeader: {
    marginBottom: 12
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  titleAccentBar: {
    width: 4,
    height: 16,
    borderRadius: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    gap: 16
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  dotDone: {
    backgroundColor: '#10B981'
  },
  timelineTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  txtDone: {
    color: '#0F172A',
    fontWeight: '700'
  },
  timelineTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  }
});
