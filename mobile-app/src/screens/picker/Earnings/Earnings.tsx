import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { useApiData } from '../../../hooks/useApiData';
import { pickerService, formatLkr } from '../../../services/picker.service';

export const PickerEarnings: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { data: stats } = useApiData(pickerService.stats, []);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Collector Earnings" subtitle="Shift commissions & payout log" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Earnings Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Weekly Earnings</Text>
          <Text style={styles.heroVal}>{formatLkr(stats?.week.earningsLkr ?? 0)}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaVal}>{stats?.week.jobs ?? 0} Pickups</Text>
              <Text style={styles.metaSub}>Completed</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.metaCol}>
              <Text style={styles.metaVal}>{stats?.week.kg ?? 0} kg</Text>
              <Text style={styles.metaSub}>Payload Total</Text>
            </View>
          </View>
        </View>

        {/* Breakdown Title */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.sectionTitle}>Daily Commission Log</Text>
          </View>
        </View>

        {(stats?.daily || []).map((d) => ({ day: d.label, jobs: `${d.jobs} pickup${d.jobs === 1 ? '' : 's'} · ${d.kg} kg`, amount: formatLkr(d.earningsLkr) })).map((item, idx) => (
          <Card key={idx} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dayTxt}>{item.day}</Text>
                <Text style={styles.jobsTxt}>{item.jobs}</Text>
              </View>
              <Text style={styles.amountTxt}>{item.amount}</Text>
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
  heroCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 24
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7'
  },
  heroVal: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginVertical: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#BAE6FD'
  },
  metaCol: {
    flex: 1,
    alignItems: 'center'
  },
  metaVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A'
  },
  metaSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2
  },
  vDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#BAE6FD'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
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
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dayTxt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  jobsTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2
  },
  amountTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0284C7'
  }
});
