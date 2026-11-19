import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../../../store/auth/AuthContext';
import { Card } from '../../../common/Card/Card';
import { useApiData } from '../../../hooks/useApiData';
import { customerService } from '../../../services/customer.service';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning 🌿' : h < 17 ? 'Good Afternoon ☀️' : 'Good Evening 🌙';
};
const fmt = (n?: number) => (n ?? 0).toLocaleString();
const scheduleLabel = (date: string, slot: string) => {
  const d = new Date(`${date}T00:00:00`);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  const day = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${day}, ${slot.split(' - ')[0]}`;
};

export const CustomerHome: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { data: dash, error, reload } = useApiData(customerService.dashboard, [user?.id]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => { setRefreshing(true); await reload(); setRefreshing(false); };
  const userDisplayName = dash?.user.name || user?.name || '';
  const next = dash?.nextPickup;
  const nextCats = next ? next.items.map((i) => i.category).join(' & ') : '';
  const initials = userDisplayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {error && <Text style={{ color: '#DC2626', padding: 12 }}>⚠️ {error}</Text>}
      {/* Top Header Bar (Clean White / Soft Background) */}
      <View style={styles.topHeader}>
        <View style={styles.headerUserRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarTxt}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.greetingSub}>{greeting()}</Text>
            <Text style={styles.userName}>{userDisplayName}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconCircleBtn} onPress={() => navigation.navigate('Notification')}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
            {!!dash?.unreadNotifications && <View style={styles.notifBadgeDot} />}
          </TouchableOpacity>
        </View>

      </View>

      {/* Main Eco Points Balance Card (Soft Emerald Mint Tint) */}
      <Card style={styles.balanceCard}>
        <View style={styles.balanceHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillTxt}>{dash?.tier.badgePillTxt || '…'}</Text>
            </View>
            <Text style={styles.balanceLabel}>Eco Points Balance</Text>
            <View style={styles.valRow}>
              <Text style={styles.balanceVal}>{fmt(dash?.wallet.totalPoints)}</Text>
              <Text style={styles.ptsUnit}>pts</Text>
            </View>
          </View>

          <View style={styles.globeBox}>
            <Text style={{ fontSize: 38 }}>🌍</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>Next: {dash?.tier.nextTierName}</Text>
            <Text style={styles.progressVal}>{fmt(dash?.wallet.totalEarned)} / {fmt(dash?.tier.targetPoints)} pts</Text>
          </View>
          <View style={styles.trackBg}>
            <View style={[styles.trackFill, { width: `${dash?.tier.percentage ?? 0}%` }]} />
          </View>
        </View>
      </Card>

      {/* Confirmed Schedule Banner */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
          <Text style={styles.sectionTitle}>Confirmed Schedule</Text>
        </View>
      </View>
      {!next ? (
        <Card style={styles.scheduleCard}>
          <Text style={styles.scheduleDesc}>No upcoming pickups. Schedule one to start earning Eco Points!</Text>
          <TouchableOpacity style={styles.trackBtn} onPress={() => navigation.navigate('CustomerPickup')} activeOpacity={0.85}>
            <Text style={styles.trackBtnTxt}>🚛 Schedule a Pickup</Text>
          </TouchableOpacity>
        </Card>
      ) : (
      <Card style={styles.scheduleCard}>
        <View style={styles.scheduleTopRow}>
          <View style={styles.confirmedPill}>
            <Text style={styles.confirmedPillTxt}>● {next.status === 'pending' ? 'Awaiting collector' : next.status === 'in_progress' ? 'Collector en route' : 'Confirmed'}</Text>
          </View>
          <Text style={styles.scheduleTime}>{scheduleLabel(next.scheduledDate, next.scheduledTimeSlot)}</Text>
        </View>
        <Text style={styles.scheduleDesc}>
          {next.id}: your {nextCats} collection (~{next.totalEstimatedWeight} kg){next.pickerName ? ` with ${next.pickerName}` : ''}. Please place sorted bins by your doorstep.
        </Text>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigation.navigate('PickupDetails', { pickupId: next.id })}
          activeOpacity={0.85}
        >
          <Text style={styles.trackBtnTxt}>📍 View Pickup Status</Text>
        </TouchableOpacity>
      </Card>
      )}

      {/* AI Waste Scanner Hero Banner */}
      <TouchableOpacity
        style={styles.aiBannerCard}
        onPress={() => navigation.navigate('AIScanner')}
        activeOpacity={0.9}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.aiPill}>
            <Text style={styles.aiPillTxt}>🤖 GOOGLE GEMINI AI</Text>
          </View>
          <Text style={styles.aiBannerTitle}>AI Waste Material Scanner</Text>
          <Text style={styles.aiBannerSub}>Point camera at waste to detect material & points</Text>
        </View>
        <View style={styles.aiScanBtn}>
          <Text style={styles.aiScanBtnTxt}>Scan 📷</Text>
        </View>
      </TouchableOpacity>


      {/* Quick Actions Grid (Spacious 2x2 Grid) */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
      </View>

      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('CustomerPickup')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconSquare, { backgroundColor: '#ECFDF5' }]}>
            <Text style={{ fontSize: 24 }}>🚛</Text>
          </View>
          <Text style={styles.quickTitle}>Schedule Pickup</Text>
          <Text style={styles.quickSub}>Request waste collection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('Wallet')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconSquare, { backgroundColor: '#E0F2FE' }]}>
            <Text style={{ fontSize: 24 }}>💳</Text>
          </View>
          <Text style={styles.quickTitle}>Eco Wallet</Text>
          <Text style={styles.quickSub}>Points & vouchers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('History')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconSquare, { backgroundColor: '#F3E8FF' }]}>
            <Text style={{ fontSize: 24 }}>🕒</Text>
          </View>
          <Text style={styles.quickTitle}>History</Text>
          <Text style={styles.quickSub}>Past pickups log</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('CustomerRewards')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconSquare, { backgroundColor: '#FEF3C7' }]}>
            <Text style={{ fontSize: 24 }}>🎁</Text>
          </View>
          <Text style={styles.quickTitle}>Rewards Store</Text>

          <Text style={styles.quickSub}>Redeem eco perks</Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Recycling Overview */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          <View style={[styles.titleAccentBar, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.sectionTitle}>Monthly Activity</Text>
        </View>
        <Text style={styles.monthBadge}>{dash?.monthly.label}</Text>
      </View>


      <Card style={styles.monthlyCard}>
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{dash?.monthly.weightKg ?? 0} kg</Text>
          <Text style={styles.statLabel}>Total Weight</Text>
        </View>

        <View style={styles.vDivider} />

        <View style={styles.statCol}>
          <Text style={styles.statVal}>{dash?.monthly.completed ?? 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.vDivider} />

        <View style={styles.statCol}>
          <Text style={[styles.statVal, { color: '#10B981' }]}>+{fmt(dash?.monthly.pointsEarned)}</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FCEB'
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  headerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTxt: {
    fontSize: 15,
    fontWeight: '900',
    color: '#D97706'
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669'
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -0.3
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  roleSwitchPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  roleSwitchTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#18181B'
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  notifBadgeDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444'
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#18181B',
    marginBottom: 24
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10
  },
  badgePillTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857'
  },
  valRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2
  },
  balanceVal: {
    fontSize: 36,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: -0.6
  },
  ptsUnit: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857'
  },
  globeBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  progressSection: {
    marginTop: 4
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857'
  },
  progressVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46'
  },
  trackBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1FAE5',
    overflow: 'hidden'
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#10B981', // Soft Emerald fill
    borderRadius: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  monthBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981'
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  scheduleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  confirmedPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  confirmedPillTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669'
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  scheduleDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 16
  },
  trackBtn: {
    backgroundColor: '#10B981',
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trackBtnTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  aiBannerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4
  },
  aiPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6
  },
  aiPillTxt: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3
  },
  aiBannerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2
  },
  aiScanBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginLeft: 10
  },
  aiScanBtnTxt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  },
  quickGrid: {

    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 24
  },
  quickCard: {
    width: '47.8%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2
  },
  iconSquare: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  quickSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2
  },
  monthlyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  statCol: {
    alignItems: 'center',
    flex: 1
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A'
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4
  },
  vDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F1F5F9'
  }
});


