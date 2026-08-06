import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../common/Button/Button';
import { Ionicons } from '@expo/vector-icons';

export const CustomerPickupSuccess: React.FC<{ navigation: any; route: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done" size={56} color="#10B981" />
        </View>

        <Text style={styles.title}>Pickup Confirmed!</Text>
        <Text style={styles.refCode}>Ref: PU-1049</Text>

        <Text style={styles.subtitle}>
          Your recyclable waste pickup has been successfully scheduled. A certified collector will arrive at your doorstep during your requested time window.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>📅 Scheduled Time</Text>
          <Text style={styles.infoBoxVal}>Tomorrow, 08:00 AM - 10:00 AM</Text>
        </View>

        <Button
          title="Track Pickup Status →"
          onPress={() => navigation.navigate('CustomerTracking')}
          style={{ width: '100%', marginTop: 20 }}
        />

        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Home')}
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
  refCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 2,
    marginBottom: 12
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center'
  },
  infoBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857'
  },
  infoBoxVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#065F46',
    marginTop: 2
  }
});
