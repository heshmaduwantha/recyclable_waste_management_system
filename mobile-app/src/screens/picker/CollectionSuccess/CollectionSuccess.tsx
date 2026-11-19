import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../common/Button/Button';
import { Ionicons } from '@expo/vector-icons';
import { useApiData } from '../../../hooks/useApiData';
import { pickerService, formatLkr } from '../../../services/picker.service';

export const PickerCollectionSuccess: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { data: history } = useApiData(pickerService.history, []);
  const last = history?.[0];
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done-circle" size={64} color="#10B981" />
        </View>

        <Text style={styles.title}>Collection Complete!</Text>
        <Text style={styles.refCode}>Ref: {last?.id ?? '—'} · Verified</Text>

        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Verified Weight</Text>
            <Text style={styles.val}>{last?.totalActualWeight ?? 0} kg</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Eco Points Credited</Text>
            <Text style={styles.valGreen}>+{last?.earnedPoints ?? 0} pts</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Picker Commission</Text>
            <Text style={styles.valBlue}>{formatLkr(last?.pickerCommissionLkr ?? 0)}</Text>
          </View>
        </View>

        <Button
          title="Return to Duty Jobs →"
          onPress={() => navigation.navigate('PickerJobsTab')}
          themeRole="picker"
          style={{ width: '100%', marginTop: 24 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  refCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 2,
    marginBottom: 20
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#BAE6FD'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B'
  },
  val: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A'
  },
  valGreen: {
    fontSize: 15,
    fontWeight: '900',
    color: '#10B981'
  },
  valBlue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0284C7'
  }
});
