import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApiData } from '../../../hooks/useApiData';
import { customerService } from '../../../services/customer.service';
import { useAuth } from '../../../store/auth/AuthContext';

const FILTERS: (undefined | 'earn' | 'redeem')[] = [undefined, 'earn', 'redeem'];

export const CustomerWallet: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [filterIdx, setFilterIdx] = useState(0);
  const filter = FILTERS[filterIdx];
  const { data, error } = useApiData(
    () => Promise.all([customerService.wallet(), customerService.walletStats(), customerService.transactions(filter)]),
    [user?.id, filter]
  );
  const [wallet, stats, transactions] = data || [null, null, []];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} bounces={false}>
      {error && <Text style={{ color: '#DC2626', padding: 12 }}>⚠️ {error}</Text>}
      {/* Soft Emerald Header Hero */}
      <View style={styles.heroHeader}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Eco Wallet</Text>
        </View>

        {/* Floating Available Eco Points Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Eco Points</Text>
          <View style={styles.pointsValRow}>
            <Text style={styles.pointsVal}>{(wallet?.totalPoints ?? 0).toLocaleString()}</Text>
            <Text style={styles.ptsUnit}>pts</Text>
          </View>
          <Text style={styles.equivTxt}>≈ LKR {(wallet?.cashEquivalentLkr ?? 0).toLocaleString()} equivalent value</Text>

          <TouchableOpacity
            style={styles.redeemBtn}
            onPress={() => navigation?.navigate?.('CustomerRewards')}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 18, marginRight: 8 }}>🎁</Text>
            <Text style={styles.redeemBtnTxt}>Redeem Rewards</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        {/* Quick Metrics Bar */}
        <View style={styles.metricsCard}>
          <View style={styles.metricCol}>
            <Text style={{ fontSize: 18, marginBottom: 4 }}>📈</Text>
            <Text style={styles.metricVal}>{(stats?.totalEarned ?? 0).toLocaleString()}</Text>
            <Text style={styles.metricSub}>Total Earned</Text>
          </View>

          <View style={styles.vDivider} />

          <View style={styles.metricCol}>
            <Text style={{ fontSize: 18, marginBottom: 4 }}>🎁</Text>
            <Text style={styles.metricVal}>{(stats?.totalRedeemed ?? 0).toLocaleString()}</Text>
            <Text style={styles.metricSub}>Redeemed</Text>
          </View>

          <View style={styles.vDivider} />

          <View style={styles.metricCol}>
            <Text style={{ fontSize: 18, marginBottom: 4 }}>♻️</Text>
            <Text style={styles.metricVal}>{stats?.totalPickups ?? 0}</Text>
            <Text style={styles.metricSub}>Pickups</Text>
          </View>
        </View>

        {/* Transactions Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Transactions{filter ? ` · ${filter === 'earn' ? 'Earned' : 'Redeemed'}` : ''}</Text>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterIdx((filterIdx + 1) % FILTERS.length)}>
            <Text style={{ fontSize: 16 }}>🌪️</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Items */}
        {transactions.length === 0 && <Text style={{ color: '#64748B', textAlign: 'center', marginTop: 12 }}>No transactions yet.</Text>}
        {transactions.map((item) => (
          <View key={item.id} style={styles.txnCard}>
            <View style={styles.txnIconBg}>
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txnTitle}>{item.title}</Text>
              <Text style={styles.txnDate}>{item.date}</Text>
            </View>
            <Text style={[styles.txnPoints, { color: item.type === 'earn' ? '#10B981' : '#EF4444' }]}>
              {item.points}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FCEB'
  },
  heroHeader: {
    backgroundColor: '#10B981', // Soft Premium Emerald Header #10B981
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1.5,
    borderBottomColor: '#18181B'
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5
  },
  qrBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ECFDF5'
  },
  pointsValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4
  },
  pointsVal: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8
  },
  ptsUnit: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)'
  },
  equivTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 18
  },
  redeemBtn: {
    backgroundColor: '#BEF264',
    height: 50,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3
  },
  redeemBtnTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#18181B'
  },
  body: {
    padding: 20
  },
  metricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  metricCol: {
    alignItems: 'center',
    flex: 1
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#18181B'
  },
  metricSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2
  },
  vDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F1F5F9'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  filterBtn: {
    padding: 4
  },
  txnCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1
  },
  txnIconBg: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  txnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  txnDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2
  },
  txnPoints: {
    fontSize: 16,
    fontWeight: '900'
  }
});


