import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Badge } from '../../../common/Badge/Badge';

export const CustomerTracking: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Header title="Live GPS Tracking" subtitle="Track your assigned eco-collector in real-time" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Map Preview Simulation */}
        <View style={styles.mapContainer}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapTitle}>Live Driver Location Active</Text>
          <Text style={styles.mapEta}>Estimated Arrival: 15 mins</Text>
        </View>

        <Card style={styles.driverCard}>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={{ fontSize: 24 }}>🚛</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>Nuwan Fernando</Text>
              <Text style={styles.vehicleNo}>Vehicle: WP CAT-4091 (Eco-Truck)</Text>
              <Text style={styles.rating}>4.9 ★ (120+ Pickups)</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={{ fontSize: 18 }}>📞</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Status Pipeline</Text>
        <View style={styles.timeline}>
          {[
            { step: 'Request Confirmed', time: '08:00 AM', done: true },
            { step: 'Picker Assigned (Nuwan)', time: '08:15 AM', done: true },
            { step: 'Collector En Route to Doorstep', time: '08:45 AM', done: true },
            { step: 'Weight Measurement & Verification', time: 'Pending', done: false },
            { step: 'Points Credited to Wallet', time: 'Pending', done: false }
          ].map((item, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={[styles.dot, item.done && styles.dotDone]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.timelineTxt, item.done && styles.txtDone]}>{item.step}</Text>
                <Text style={styles.timelineTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  body: {
    padding: 16
  },
  mapContainer: {
    height: 200,
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#93C5FD'
  },
  mapIcon: {
    fontSize: 42,
    marginBottom: 6
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  mapEta: {
    fontSize: 13,
    color: '#0284C7',
    fontWeight: '700',
    marginTop: 2
  },
  driverCard: {
    marginBottom: 20
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  vehicleNo: {
    fontSize: 12,
    color: '#64748B'
  },
  rating: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
    marginTop: 2
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12
  },
  timeline: {
    gap: 16,
    paddingLeft: 8
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBD5E1'
  },
  dotDone: {
    backgroundColor: '#2563EB'
  },
  timelineTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8'
  },
  txtDone: {
    color: '#0F172A'
  },
  timelineTime: {
    fontSize: 11,
    color: '#94A3B8'
  }
});
