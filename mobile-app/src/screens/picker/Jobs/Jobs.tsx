import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { mockPickupsList } from '../../../mock/pickups';

export const PickerJobs: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  const activeJobs = mockPickupsList.filter(j => j.status === 'pending' || j.status === 'in_progress');
  const historyJobs = [
    { id: 'PU-8821', customerName: 'Nimal Silva', phone: '+94 77 999 8877', address: '45 Galle Road, Colombo 03', completedAt: 'Today, 2:15 PM', weightKg: 14.5, earnedPts: 290, status: 'Completed' },
    { id: 'PU-8819', customerName: 'Kamal Perera', phone: '+94 71 222 3344', address: '88 Kandy Road, Malabe', completedAt: 'Yesterday, 11:30 AM', weightKg: 22.0, earnedPts: 440, status: 'Completed' },
    { id: 'PU-8815', customerName: 'Anura Fernando', phone: '+94 70 555 1122', address: '12 Marine Drive, Bambalapitiya', completedAt: 'Aug 05, 4:00 PM', weightKg: 8.0, earnedPts: 160, status: 'Completed' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} bounces={false}>
      <Header title="Collector Jobs & History" subtitle="Active pickup queue & completed trip logs" />

      <View style={styles.body}>
        {/* Pitch Deck Segmented Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'queue' && styles.activeTabBtn]}
            onPress={() => setActiveTab('queue')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabTxt, activeTab === 'queue' && styles.activeTabTxt]}>
              📋 Active Queue ({activeJobs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'history' && styles.activeTabBtn]}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabTxt, activeTab === 'history' && styles.activeTabTxt]}>
              📜 Completed History ({historyJobs.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ACTIVE QUEUE TAB */}
        {activeTab === 'queue' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.titleGroup}>
                <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
                <Text style={styles.sectionTitle}>Assigned Pickup Requests</Text>
              </View>
            </View>

            {activeJobs.map((job) => (
              <Card key={job.id} style={styles.card}>
                <View style={styles.header}>
                  <Text style={styles.id}>{job.id}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusTxt}>{job.status}</Text>
                  </View>
                </View>

                <Text style={styles.customer}>{job.customerName}</Text>
                <Text style={styles.phoneTxt}>📞 {job.customerPhone}</Text>
                <Text style={styles.address}>📍 {job.address.street}, {job.address.city}</Text>

                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() => navigation.navigate('PickerGPS', { jobId: job.id })}
                  activeOpacity={0.85}
                >
                  <Text style={styles.detailTxt}>Start Navigation & Verification →</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}

        {/* COMPLETED HISTORY TAB */}
        {activeTab === 'history' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.titleGroup}>
                <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
                <Text style={styles.sectionTitle}>Completed Pickup Logs</Text>
              </View>
            </View>

            {historyJobs.map((item) => (
              <Card key={item.id} style={styles.historyCard}>
                <View style={styles.header}>
                  <Text style={styles.id}>{item.id}</Text>
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeTxt}>✓ {item.status}</Text>
                  </View>
                </View>

                <Text style={styles.customer}>{item.customerName}</Text>
                <Text style={styles.address}>📍 {item.address}</Text>

                <View style={styles.historyMetaRow}>
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipTxt}>⚖️ {item.weightKg} kg verified</Text>
                  </View>
                  <View style={styles.metaChipPts}>
                    <Text style={styles.metaChipPtsTxt}>⭐ +{item.earnedPts} pts credited</Text>
                  </View>
                </View>

                <Text style={styles.completedTimeTxt}>Completed: {item.completedAt}</Text>
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF' // Soft Sky Blue Background for Collector
  },
  body: {
    padding: 20
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9999,
    alignItems: 'center'
  },
  activeTabBtn: {
    backgroundColor: '#0284C7',
    borderWidth: 1.5,
    borderColor: '#0F172A'
  },
  tabTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  activeTabTxt: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  id: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B'
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#0F172A'
  },
  statusTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    textTransform: 'capitalize'
  },
  completedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#0F172A'
  },
  completedBadgeTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669'
  },
  customer: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A'
  },
  phoneTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2
  },
  address: {
    fontSize: 13,
    color: '#334155',
    marginTop: 4,
    marginBottom: 12,
    fontWeight: '600'
  },
  detailBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  detailTxt: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },
  historyMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8
  },
  metaChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  metaChipTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155'
  },
  metaChipPts: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#F59E0B'
  },
  metaChipPtsTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706'
  },
  completedTimeTxt: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4
  }
});
