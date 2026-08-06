import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';

export const PickerVehicleDetails: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Vehicle Specification" subtitle="Truck WP-5842 capacity & status" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Vehicle Hero Card */}
        <View style={styles.heroCard}>
          <Text style={{ fontSize: 52 }}>🚚</Text>
          <Text style={styles.vTitle}>Eco Truck WP-5842</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusTxt}>● Active Duty</Text>
          </View>
        </View>

        {/* Payload Progress Bar */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Payload Capacity Load</Text>
          <Text style={styles.loadVal}>142.5 kg / 500 kg (28.5% full)</Text>

          <View style={styles.trackBg}>
            <View style={[styles.trackFill, { width: '28.5%' }]} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Vehicle Maintenance</Text>
          <Text style={styles.infoRow}>Fuel Level: 84% (Full Tank)</Text>
          <Text style={styles.infoRow}>Last Serviced: Jul 15, 2026</Text>
          <Text style={styles.infoRow}>Inspection Status: Passed ✓</Text>
        </Card>
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
  heroCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 24
  },
  vTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 8
  },
  statusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  statusTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8
  },
  loadVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 10
  },
  trackBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0F2FE',
    overflow: 'hidden'
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 5
  },
  infoRow: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 4
  }
});
