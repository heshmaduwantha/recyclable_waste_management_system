import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Button } from '../../../common/Button/Button';
import { usePickup } from '../../../store/pickup/PickupContext';
import { useAuth } from '../../../store/auth/AuthContext';
import { pickerService, CompleteResult, formatLkr } from '../../../services/picker.service';

export const PickerWeight: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { activeJob, setActiveJob } = usePickup();
  const { user } = useAuth();
  const [actualWeight, setActualWeight] = useState(activeJob ? String(activeJob.totalEstimatedWeight) : '');
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedId, setCompletedId] = useState<string | null>(null);

  // Live estimate of points using the job's per-category rates (server recalculates on submit)
  const estPtsPerKg = activeJob ? activeJob.estimatedPoints / activeJob.totalEstimatedWeight : 0;
  const weightNum = parseFloat(actualWeight) || 0;

  const handleComplete = async () => {
    if (!activeJob) {
      setError('No active job selected. Accept a job from the Home screen first.');
      return;
    }
    if (!(weightNum > 0)) {
      setError('Enter a weight greater than 0 kg.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await pickerService.complete(activeJob.id, weightNum);
      setCompletedId(activeJob.id);
      setResult(res);
      setActiveJob(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <View style={styles.completeContainer}>
        <View style={styles.graphicBox}>
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <View style={styles.checkCircle}>
                <Text style={{ fontSize: 40, color: '#FFFFFF', fontWeight: '900' }}>✓</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.starDot, { top: 10, right: 30 }]}>⭐</Text>
          <Text style={[styles.starDot, { bottom: 20, left: 20 }]}>⭐</Text>
          <View style={[styles.colorDot, { top: 30, left: 35, backgroundColor: '#F59E0B' }]} />
          <View style={[styles.colorDot, { bottom: 35, right: 35, backgroundColor: '#38BDF8' }]} />
        </View>

        <Text style={styles.completeTitle}>Collection Complete!</Text>
        <Text style={styles.completeSub}>Great work, {user?.name?.split(' ')[0]}! 🌟 ({completedId})</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Weight Collected</Text>
            <Text style={styles.summaryDarkVal}>{result.actualWeightKg} kg</Text>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Customer Earned</Text>
            <Text style={styles.summaryGreenVal}>+{result.earnedPoints} pts</Text>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Your Commission</Text>
            <Text style={styles.summaryBlueVal}>{formatLkr(result.commissionLkr)}</Text>
          </View>
        </View>

        <Button
          title="Back to Dashboard"
          onPress={() => navigation.navigate('PickerHomeMain')}
          themeRole="picker"
          style={{ width: '100%', marginTop: 24 }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.stepTitle}>Doorstep Weight Measure</Text>
      <Text style={styles.stepSub}>
        {activeJob ? `${activeJob.id} · ${activeJob.customerName} · declared ~${activeJob.totalEstimatedWeight} kg` : 'No active job — accept one from Home first'}
      </Text>

      <View style={styles.scaleDisplay}>
        <Text style={styles.scaleLabel}>VERIFIED WEIGHT</Text>
        <Text style={styles.scaleVal}>{weightNum || 0} KG</Text>
        <Text style={styles.scaleSub}>Points to Credit: ~{Math.round(weightNum * estPtsPerKg)} PTS</Text>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>MANUAL WEIGHT OVERRIDE (KG)</Text>
        <TextInput
          style={styles.weightInput}
          value={actualWeight}
          onChangeText={setActualWeight}
          keyboardType="decimal-pad"
        />
      </View>

      <TouchableOpacity style={styles.camBtn} onPress={() => navigation.navigate('PickerCamera')}>
        <Text style={styles.camTxt}>📸 Take Doorstep Verification Photo</Text>
      </TouchableOpacity>

      {error && <Text style={{ color: '#DC2626', fontWeight: '600', marginTop: 12 }}>⚠️ {error}</Text>}

      <Button
        title="Complete Collection & Submit"
        onPress={handleComplete}
        loading={submitting}
        disabled={submitting || !activeJob}
        themeRole="picker"
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 20
  },
  stepSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 20
  },
  completeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  graphicBox: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 28
  },
  outerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#DCFCE7', // Soft green ring
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4
  },
  starDot: {
    position: 'absolute',
    fontSize: 20
  },
  colorDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4
  },
  completeTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5
  },
  completeSub: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#F0F9FF', // Soft Blue Tint #F0F9FF
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0F2FE'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E0F2FE'
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569'
  },
  summaryDarkVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
  },
  summaryGreenVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#22C55E'
  },
  summaryBlueVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0284C7'
  },
  scaleDisplay: {
    backgroundColor: '#0284C7',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20
  },
  scaleLabel: {
    color: '#E0F2FE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1
  },
  scaleVal: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    marginVertical: 6
  },
  scaleSub: {
    color: '#FEF3C7',
    fontSize: 14,
    fontWeight: '800'
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8
  },
  weightInput: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A'
  },
  camBtn: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0284C7',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 6
  },
  camTxt: {
    color: '#0284C7',
    fontWeight: '800',
    fontSize: 14
  }
});

