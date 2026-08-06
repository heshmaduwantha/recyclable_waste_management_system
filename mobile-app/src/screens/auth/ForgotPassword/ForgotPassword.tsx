import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../../../common/Input/Input';
import { Button } from '../../../common/Button/Button';

export const ForgotPassword: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>We will send a reset link to your registered email</Text>

      <Input
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com"
        keyboardType="email-address"
      />

      <Button
        title="Send Reset Link"
        onPress={() => navigation.navigate('Login')}
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
    justifyContent: 'center'
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
    marginBottom: 24
  }
});
