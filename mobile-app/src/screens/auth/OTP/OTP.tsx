import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../../../common/Input/Input';
import { Button } from '../../../common/Button/Button';
import { useAuth } from '../../../store/auth/AuthContext';

export const OTP: React.FC<{ navigation: any }> = () => {
  const { login } = useAuth();
  const [code, setCode] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📲</Text>
      <Text style={styles.title}>Verify Phone Number</Text>
      <Text style={styles.subtitle}>Enter the 4-digit code sent to your mobile</Text>

      <Input
        value={code}
        onChangeText={setCode}
        placeholder="1 2 3 4"
        keyboardType="number-pad"
        maxLength={4}
        style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
      />

      <Button
        title="Verify & Enter App"
        onPress={() => login('customer')}
        themeRole="customer"
        style={{ width: '100%', marginTop: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: 64,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A'
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 24,
    textAlign: 'center'
  }
});
