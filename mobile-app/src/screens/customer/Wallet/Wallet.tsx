import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export const CustomerWallet: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const transactions = [
    { id: '1', title: 'Plastic Pickup #047', date: 'Today', points: '+125 pts', type: 'earn', icon: '🧴' },
    { id: '2', title: 'Mobitel Recharge', date: 'Aug 5', points: '-500 pts', type: 'redeem', icon: '📱' },
    { id: '3', title: 'Glass Pickup #041', date: 'Aug 4', points: '+90 pts', type: 'earn', icon: '🫙' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} bounces={false}>
      {/* Soft Emerald Header Hero */}
      <View style={styles.heroHeader}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Eco Wallet</Text>
          <TouchableOpacity style={styles.qrBtn}>
            <Text style={{ fontSize: 20 }}>🔳</Text>
          </TouchableOpacity>
        </View>

        {/* Floating Available Eco Points Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Eco Points</Text>
          <View style={styles.pointsValRow}>
            <Text style={styles.pointsVal}>2,450</Text>
            <Text style={styles.ptsUnit}>pts</Text>
          </View>
          <Text style={styles.equivTxt}>≈ LKR 490 equivalent value</Text>

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
            <Text style={styles.metricVal}>3,450</Text>
            <Text style={styles.metricSub}>Total Earned</Text>
          </View>

          <View style={styles.vDivider} />

          <View style={styles.metricCol}>
            <Text style={{ fontSize: 18, marginBottom: 4 }}>🎁</Text>
            <Text style={styles.metricVal}>1,000</Text>
            <Text style={styles.metricSub}>Redeemed</Text>
          </View>

          <View style={styles.vDivider} />

          <View style={styles.metricCol}>
            <Text style={{ fontSize: 18, marginBottom: 4 }}>♻️</Text>
            <Text style={styles.metricVal}>24</Text>
            <Text style={styles.metricSub}>Pickups</Text>
          </View>
        </View>

        {/* Transactions Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={{ fontSize: 16 }}>🌪️</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Items */}
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
    backgroundColor: '#F8FAFC'
  },
  heroHeader: {
    backgroundColor: '#10B981', // Soft Premium Emerald Header #10B981
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)'
  },
  pointsValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: 4
  },
  pointsVal: {
    fontSize: 38,
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
    backgroundColor: '#F59E0B',
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3
  },
  redeemBtnTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
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
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2
  },
  metricCol: {
    alignItems: 'center',
    flex: 1
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A'
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


