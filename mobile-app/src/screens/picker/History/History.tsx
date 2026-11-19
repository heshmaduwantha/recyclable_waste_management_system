import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Ionicons } from '@expo/vector-icons';
import { useApiData } from '../../../hooks/useApiData';
import { pickerService, formatLkr } from '../../../services/picker.service';

export const PickerHistory: React.FC = () => {
  const { data, error } = useApiData(() => Promise.all([pickerService.history(), pickerService.stats()]), []);
  const [history, stats] = data || [[], null];
  const historyItems = history.map((h) => {
    const d = new Date(h.completedAt || h.createdAt);
    return {
      id: h.id, cust: h.customerName, weight: `${h.totalActualWeight} kg`, items: h.categories,
      payout: formatLkr(h.pickerCommissionLkr),
      date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Collector Shift History" subtitle="Completed waste collection log & driver earnings" />

      <View style={styles.body}>
        {/* Shift Summary Metrics Card */}
        <View style={styles.summaryHeroCard}>
          <Text style={styles.summaryTitle}>Lifetime Collection Log</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#0284C7' }]}>{stats?.totalKg ?? 0} kg</Text>
              <Text style={styles.metricSub}>Collected</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#10B981' }]}>{stats?.totalJobsDone ?? 0}</Text>
              <Text style={styles.metricSub}>Pickups</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#D97706' }]}>{formatLkr(stats?.totalEarningsLkr ?? 0)}</Text>
              <Text style={styles.metricSub}>Commission</Text>
            </View>
          </View>
        </View>

        {/* Section Header with Accent Bar */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.sectionTitle}>Completed Shift Logs</Text>
          </View>
          <Text style={styles.totalCountTxt}>{historyItems.length} records</Text>
        </View>

        {/* History List Cards */}
        {error && <Text style={{ color: '#DC2626' }}>⚠️ {error}</Text>}
        {historyItems.map((item, idx) => (
          <Card key={idx} style={styles.historyCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.iconBg}>
                <Ionicons name="checkmark-done-circle" size={24} color="#10B981" />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.idRow}>
                  <Text style={styles.idTxt}>{item.id}</Text>
                  <View style={styles.verifiedPill}>
                    <Text style={styles.verifiedTxt}>● Verified</Text>
                  </View>
                </View>
                <Text style={styles.custName}>{item.cust}</Text>
                <Text style={styles.itemsSub}>{item.items}</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.weightTxt}>{item.weight}</Text>
                <Text style={styles.payoutTxt}>{item.payout}</Text>
              </View>
            </View>

            <View style={styles.cardFooterRow}>
              <Text style={styles.dateTxt}>📅 {item.date} · {item.time}</Text>
              <Text style={styles.viewDetailTxt}>Log Details →</Text>
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
    backgroundColor: '#F0F9FF' // Soft Ocean Sky Blue for Collector
  },
  contentContainer: {
    paddingBottom: 40
  },
  body: {
    padding: 20
  },
  summaryHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 14
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  metricCol: {
    alignItems: 'center',
    flex: 1
  },
  metricVal: {
    fontSize: 19,
    fontWeight: '900'
  },
  metricSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2
  },
  vDivider: {
    width: 1.5,
    height: 30,
    backgroundColor: '#CBD5E1'
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
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7'
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0F172A'
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  idTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B'
  },
  verifiedPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#0F172A'
  },
  verifiedTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669'
  },
  custName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2
  },
  itemsSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 1
  },
  weightTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#10B981'
  },
  payoutTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 2
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F9FF'
  },
  dateTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  viewDetailTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7'
  }
});
