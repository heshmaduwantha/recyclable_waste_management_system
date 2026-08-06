import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../store/auth/AuthContext';
import { Card } from '../../../common/Card/Card';

export const PickerHome: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, switchRole } = useAuth();
  const [jobs, setJobs] = useState([
    {
      id: 'ECO#048',
      customer: 'Amali Fernando',
      address: '45 Ward Place, Col 07',
      details: 'Plastic, Glass · ~3 kg · 1.2 km',
      status: 'Pending'
    },
    {
      id: 'ECO#049',
      customer: 'Kasun Perera',
      address: '78 Duplication Rd, Col 03',
      details: 'Paper, Metal · ~5 kg · 2.4 km',
      status: 'Pending'
    }
  ]);

  const handleAccept = (jobId: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'Accepted' } : j));
    navigation.navigate('PickerJobDetails', { jobId });
  };

  const handleReject = (jobId: string) => {
    setJobs(jobs.filter(j => j.id !== jobId));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} bounces={false}>
      {/* Light Sky Blue Hero Header (#F0F9FF) */}
      <View style={styles.heroHeader}>
        <View style={styles.headerTopRow}>
          <View>
            <View style={styles.pickerAppRow}>
              <Text style={styles.pickerAppSub}>Collector Operations 🚚</Text>
            </View>
            <Text style={styles.pickerName}>{user?.name || 'Suresh Kumar'}</Text>
          </View>

          <View style={styles.headerRightRow}>
            <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('PickerProfileTab')}>
              <Text style={styles.avatarTxt}>SK</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Active Status Pill Bar */}
        <View style={styles.statusPillBar}>
          <View style={styles.statusLiveRow}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.statusLiveTxt}>Active · On Duty</Text>
          </View>
          <Text style={styles.statusTimeTxt}>08:45 AM</Text>
        </View>

        {/* 4 Stat Metrics Cards Overlapping Header */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: '#0284C7' }]}>5</Text>
            <Text style={styles.metricLabel}>Jobs</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: '#10B981' }]}>2</Text>
            <Text style={styles.metricLabel}>Done</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: '#F59E0B' }]}>3</Text>
            <Text style={styles.metricLabel}>Pending</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: '#8B5CF6' }]}>4.9<Text style={{ fontSize: 13, color: '#F59E0B' }}>⭐</Text></Text>
            <Text style={styles.metricLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Main Body */}
      <View style={styles.bodyContent}>
        {/* Route Map Preview Card */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Route Map</Text>
          </View>
        </View>

        <View style={styles.mapPreviewCard}>
          <View style={styles.mapGraphicBox}>
            <Text style={{ fontSize: 36 }}>🗺️</Text>
            <View style={styles.mapLineSim}>
              <View style={[styles.mapMarker, { backgroundColor: '#10B981' }]} />
              <View style={styles.mapDashLine} />
              <View style={[styles.mapMarker, { backgroundColor: '#EF4444' }]} />
            </View>
          </View>
        </View>

        {/* Today's Jobs Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.sectionTitle}>Today's Jobs</Text>
          </View>
          <Text style={styles.totalCountTxt}>{jobs.length} total</Text>
        </View>

        {/* Job Cards List */}
        {jobs.map((job) => (
          <Card key={job.id} style={styles.jobCard}>
            <View style={styles.jobTopRow}>
              <Text style={styles.jobIdTxt}>{job.id}</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeTxt}>{job.status}</Text>
              </View>
            </View>

            <Text style={styles.customerName}>{job.customer}</Text>

            <View style={styles.addressRow}>
              <Text style={{ fontSize: 14, marginRight: 6 }}>📍</Text>
              <Text style={styles.addressTxt}>{job.address}</Text>
            </View>

            <Text style={styles.detailsTxt}>{job.details}</Text>

            {/* Action Buttons Side-by-Side */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleAccept(job.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.acceptBtnTxt}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleReject(job.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.rejectBtnTxt}>Reject</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  heroHeader: {
    backgroundColor: '#F0F9FF', // Soft Light Sky Blue Theme
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1.5,
    borderBottomColor: '#BAE6FD',
    position: 'relative'
  },

  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  pickerAppRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickerAppSub: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7'
  },
  pickerName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  roleSwitchPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD'
  },
  roleSwitchTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7'
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTxt: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  statusPillBar: {
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD'
  },
  statusLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  statusLiveTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7'
  },
  statusTimeTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1'
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: -65
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3
  },
  metricNum: {
    fontSize: 22,
    fontWeight: '900'
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 55
  },
  mapPreviewCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    height: 130
  },
  mapGraphicBox: {
    alignItems: 'center'
  },
  mapLineSim: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  mapMarker: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  mapDashLine: {
    width: 80,
    height: 2,
    borderWidth: 1,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    marginHorizontal: 4
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  totalCountTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7'
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14
  },
  jobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  jobIdTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8'
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14
  },
  pendingBadgeTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706'
  },
  customerName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  addressTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569'
  },
  detailsTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  acceptBtnTxt: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rejectBtnTxt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569'
  }
});



