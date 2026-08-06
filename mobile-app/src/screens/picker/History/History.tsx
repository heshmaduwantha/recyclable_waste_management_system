import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Ionicons } from '@expo/vector-icons';

export const PickerHistory: React.FC = () => {
  const historyItems = [
    { id: 'PU-8820', cust: 'Kasun Perera', weight: '32 kg', items: 'Plastic, Glass', payout: 'LKR 1,120', date: 'Aug 02, 2026', time: '10:30 AM' },
    { id: 'PU-8815', cust: 'Dilini Fernando', weight: '21 kg', items: 'Paper, Metal', payout: 'LKR 735', date: 'Aug 01, 2026', time: '02:15 PM' },
    { id: 'PU-8809', cust: 'Saman Kumara', weight: '18.5 kg', items: 'E-Waste, Glass', payout: 'LKR 1,450', date: 'Jul 29, 2026', time: '11:00 AM' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Shift History" subtitle="Completed waste collection log & earnings" />

      <View style={styles.body}>
        {/* Shift Summary Metrics Card */}
        <View style={styles.summaryHeroCard}>
          <Text style={styles.summaryTitle}>Total Shift Payload</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#0284C7' }]}>71.5 kg</Text>
              <Text style={styles.metricSub}>Collected</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#10B981' }]}>3</Text>
              <Text style={styles.metricSub}>Pickups</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#F59E0B' }]}>LKR 3,305</Text>
              <Text style={styles.metricSub}>Commission</Text>
            </View>
          </View>
        </View>

        {/* Section Header with Accent Bar */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.sectionTitle}>Completed Collections</Text>
          </View>
          <Text style={styles.totalCountTxt}>{historyItems.length} records</Text>
        </View>

        {/* History List Cards */}
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
                    <Text style={styles.verifiedTxt}>● Completed</Text>
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
              <Text style={styles.viewDetailTxt}>Details →</Text>
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
  contentContainer: {
    paddingBottom: 40
  },
  body: {
    padding: 20
  },
  summaryHeroCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
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
    width: 1,
    height: 30,
    backgroundColor: '#BAE6FD'
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
    borderWidth: 1,
    borderColor: '#F1F5F9'
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
    justifyContent: 'center'
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  idTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8'
  },
  verifiedPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
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
    color: '#64748B',
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
    borderTopColor: '#F8FAFC'
  },
  dateTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8'
  },
  viewDetailTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7'
  }
});

