import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Button } from '../../../common/Button/Button';
import { useApiData } from '../../../hooks/useApiData';
import { pickerService, formatLkr } from '../../../services/picker.service';

export const PickerShiftSummary: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { data: stats } = useApiData(pickerService.stats, []);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Shift Summary" subtitle="End of duty collection report" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Shift Hero Summary */}
        <View style={styles.heroCard}>
          <Text style={styles.shiftTitle}>Today's Shift Summary</Text>
          <Text style={styles.shiftSub}>{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} · {stats?.activeJobs ?? 0} jobs still open</Text>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridVal}>{stats?.today.kg ?? 0} kg</Text>

              <Text style={styles.gridSub}>Total Payload</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridVal}>{stats?.today.jobs ?? 0}</Text>
              <Text style={styles.gridSub}>Jobs Done</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridVal}>{formatLkr(stats?.today.earningsLkr ?? 0)}</Text>
              <Text style={styles.gridSub}>Commission</Text>
            </View>
          </View>
        </View>

        <Button title="Clock Out Shift" onPress={() => navigation.navigate('PickerHomeTab')} themeRole="picker" style={{ marginTop: 16 }} />
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
    borderRadius: 26,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 24
  },
  shiftTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  shiftSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 4,
    marginBottom: 20
  },
  grid: {
    flexDirection: 'row',
    gap: 12
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD'
  },
  gridVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
  },
  gridSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2
  }
});
