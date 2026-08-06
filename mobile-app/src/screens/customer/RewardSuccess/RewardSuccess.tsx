import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../common/Button/Button';
import { Ionicons } from '@expo/vector-icons';

export const CustomerRewardSuccess: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="phone-portrait" size={54} color="#10B981" />
        </View>

        <Text style={styles.title}>Mobile Reload Sent! 📱</Text>
        <Text style={styles.rewardTitle}>Dialog / Mobitel Airtime Top-Up</Text>

        {/* Promo Code / Transaction Box */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>TRANSACTION REFERENCE</Text>
          <Text style={styles.codeTxt}>TXN-RLD-8820</Text>
          <Text style={styles.codeSub}>Airtime credited to 077 123 4567</Text>
        </View>

        <Text style={styles.validityTxt}>Processed via EcoCollect Rewards API</Text>

        <Button
          title="View in Eco Wallet →"
          onPress={() => navigation.navigate('Wallet')}
          style={{ width: '100%', marginTop: 24 }}
        />

        <Button
          title="Back to Rewards"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={{ width: '100%', marginTop: 10 }}
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
  rewardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 2,
    marginBottom: 16
  },
  codeCard: {
    width: '100%',
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderStyle: 'dashed'
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1
  },
  codeTxt: {
    fontSize: 24,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 2,
    marginVertical: 4
  },
  codeSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857'
  },

  validityTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 14
  }
});
