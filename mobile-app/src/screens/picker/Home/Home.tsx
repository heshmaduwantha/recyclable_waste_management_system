import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../../store/auth/AuthContext';
import { Card } from '../../../common/Card/Card';
import { apiCall } from '../../../services/api';

export const PickerHome: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Rejection Comment Modal State
  const [rejectModalJobId, setRejectModalJobId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  useEffect(() => {
    loadJobs();
    // Auto-poll for new job allocations every 6 seconds
    const timer = setInterval(() => {
      loadJobs(true);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  async function loadJobs(silent = false) {
    if (!silent) setLoading(true);
    try {
      const data = await apiCall<any[]>('/picker/jobs');
      setJobs(data);
    } catch {
      setJobs([
        { id: 'ECO#048', customer: 'Amali Fernando', customerPhone: '+94 77 999 8888', address: '45 Ward Place, Col 07', details: 'Plastic, Glass · ~3 kg · 1.2 km', status: 'Assigned' },
        { id: 'ECO#049', customer: 'Kasun Perera', customerPhone: '+94 77 123 4567', address: '78 Duplication Rd, Col 03', details: 'Paper, Metal · ~5 kg · 2.4 km', status: 'Assigned' }
      ]);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  const handleAccept = async (jobId: string) => {
    try {
      await apiCall(`/picker/jobs/${jobId}/accept`, { method: 'PUT' });
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'Accepted' } : j));
    } catch (err) {
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'Accepted' } : j));
    }
    navigation.navigate('PickerGPS');
  };

  const openRejectModal = (jobId: string) => {
    setRejectModalJobId(jobId);
    setRejectionReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalJobId) return;
    setSubmittingReject(true);
    try {
      await apiCall(`/picker/jobs/${rejectModalJobId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason || 'Capacity full / Route constraint' })
      });
      setJobs(jobs.filter(j => j.id !== rejectModalJobId));
      setRejectModalJobId(null);
    } catch (err) {
      setJobs(jobs.filter(j => j.id !== rejectModalJobId));
      setRejectModalJobId(null);
    } finally {
      setSubmittingReject(false);
    }
  };

  const pickerDisplayName = user?.name || 'Suresh Kumar';
  const pickerInitials = pickerDisplayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SK';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      bounces={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0284C7']} />}
    >
      {/* Light Sky Blue Hero Header (#F0F9FF) */}
      <View style={styles.heroHeader}>
        <View style={styles.headerTopRow}>
          <View>
            <View style={styles.pickerAppRow}>
              <Text style={styles.pickerAppSub}>Collector Operations 🚚</Text>
            </View>
            <Text style={styles.pickerName}>{pickerDisplayName}</Text>
          </View>

          <View style={styles.headerRightRow}>
            <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('PickerProfileTab')}>
              <Text style={styles.avatarTxt}>{pickerInitials}</Text>
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
            <Text style={[styles.metricNum, { color: '#0284C7' }]}>{jobs.length}</Text>
            <Text style={styles.metricLabel}>Jobs</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: '#10B981' }]}>2</Text>
            <Text style={styles.metricLabel}>Done</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: '#F59E0B' }]}>{jobs.filter(j => j.status !== 'Accepted').length}</Text>
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
            <Text style={styles.sectionTitle}>Allocation Route Map</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.mapPreviewCard} onPress={() => navigation.navigate('PickerGPS')}>
          <View style={styles.mapGraphicBox}>
            <Text style={{ fontSize: 32 }}>🗺️</Text>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#047857', marginTop: 4 }}>Tap to Open Interactive GPS Route</Text>
            <View style={styles.mapLineSim}>
              <View style={[styles.mapMarker, { backgroundColor: '#10B981' }]} />
              <View style={styles.mapDashLine} />
              <View style={[styles.mapMarker, { backgroundColor: '#EF4444' }]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Today's Jobs Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.sectionTitle}>Allocated Pickup Jobs</Text>
          </View>
          <Text style={styles.totalCountTxt}>{jobs.length} total</Text>
        </View>

        {/* Job Cards List */}
        {jobs.map((job) => (
          <Card key={job.id} style={styles.jobCard}>
            <View style={styles.jobTopRow}>
              <Text style={styles.jobIdTxt}>{job.id}</Text>
              <View style={[styles.pendingBadge, job.status === 'Accepted' && { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.pendingBadgeTxt, job.status === 'Accepted' && { color: '#059669' }]}>
                  {job.status}
                </Text>
              </View>
            </View>

            <Text style={styles.customerName}>{job.customer}</Text>

            <View style={styles.addressRow}>
              <Text style={{ fontSize: 14, marginRight: 6 }}>📍</Text>
              <Text style={styles.addressTxt}>{job.address}</Text>
            </View>

            <Text style={styles.detailsTxt}>{job.details}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleAccept(job.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.acceptBtnTxt}>{job.status === 'Accepted' ? 'View GPS Route 🗺️' : 'Accept Job ✅'}</Text>
              </TouchableOpacity>

              {job.status !== 'Accepted' && (
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => openRejectModal(job.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.rejectBtnTxt}>Reject ❌</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        ))}
      </View>

      {/* Rejection Comment Modal (Reason sent ONLY to Admin) */}
      <Modal visible={!!rejectModalJobId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Allocated Job</Text>
            <Text style={styles.modalSub}>Please provide a reason for rejecting job {rejectModalJobId}. (This comment is recorded for Admin review only).</Text>

            <TextInput
              style={styles.reasonInput}
              multiline
              numberOfLines={3}
              placeholder="e.g. Vehicle engine trouble / Truck capacity full on Havelock Road"
              value={rejectionReason}
              onChangeText={setRejectionReason}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setRejectModalJobId(null)}>
                <Text style={styles.cancelBtnTxt}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitRejectBtn} onPress={handleConfirmReject} disabled={submittingReject}>
                {submittingReject ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitRejectBtnTxt}>Send Comment to Admin</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  heroHeader: {
    backgroundColor: '#E0F2FE',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1.5,
    borderBottomColor: '#0F172A',
    position: 'relative'
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pickerAppRow: { flexDirection: 'row', alignItems: 'center' },
  pickerAppSub: { fontSize: 12, fontWeight: '800', color: '#0284C7' },
  pickerName: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.4 },
  headerRightRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0284C7', borderWidth: 1.5, borderColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  statusPillBar: {
    backgroundColor: '#FFFFFF', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
    borderWidth: 1.5, borderColor: '#0F172A'
  },
  statusLiveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveGreenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  statusLiveTxt: { fontSize: 13, fontWeight: '800', color: '#0284C7' },
  statusTimeTxt: { fontSize: 12, fontWeight: '700', color: '#0369A1' },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: -65 },
  metricCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#0F172A', shadowColor: '#0F172A', shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3
  },
  metricNum: { fontSize: 22, fontWeight: '900' },
  metricLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 2 },
  bodyContent: { paddingHorizontal: 20, paddingTop: 55 },
  mapPreviewCard: {
    backgroundColor: '#ECFDF5', borderRadius: 24, padding: 16, alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, borderWidth: 1, borderColor: '#A7F3D0'
  },
  mapGraphicBox: { alignItems: 'center' },
  mapLineSim: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  mapMarker: { width: 12, height: 12, borderRadius: 6 },
  mapDashLine: { width: 80, height: 2, borderWidth: 1, borderColor: '#10B981', borderStyle: 'dashed', marginHorizontal: 4 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titleGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleAccentBar: { width: 4, height: 18, borderRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', letterSpacing: -0.3 },
  totalCountTxt: { fontSize: 13, fontWeight: '800', color: '#0284C7' },
  jobCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginBottom: 14 },
  jobTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  jobIdTxt: { fontSize: 13, fontWeight: '800', color: '#94A3B8' },
  pendingBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 },
  pendingBadgeTxt: { fontSize: 11, fontWeight: '800', color: '#D97706' },
  customerName: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 6 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  addressTxt: { fontSize: 13, fontWeight: '700', color: '#475569' },
  detailsTxt: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 16 },
  actionButtonsRow: { flexDirection: 'row', gap: 12 },
  acceptBtn: { flex: 1, backgroundColor: '#10B981', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  acceptBtnTxt: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  rejectBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#EF4444', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  rejectBtnTxt: { fontSize: 14, fontWeight: '800', color: '#EF4444' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 6 },
  modalSub: { fontSize: 13, color: '#64748B', lineHeight: 18, marginBottom: 16 },
  reasonInput: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 12, fontSize: 14, textAlignVertical: 'top', marginBottom: 20 },
  modalBtnRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  cancelBtnTxt: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  submitRejectBtn: { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  submitRejectBtnTxt: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' }
});
