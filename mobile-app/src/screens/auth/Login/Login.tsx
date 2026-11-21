import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Input } from '../../../common/Input/Input';
import { Button } from '../../../common/Button/Button';
import { useAuth } from '../../../store/auth/AuthContext';
import { authService } from '../../../services/auth.service';
import { UserRole } from '../../../../../shared/types';

export const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const userObj = await authService.login(email.trim(), password);
      const actualRole: UserRole = (userObj.role as UserRole) || 'customer';
      login(actualRole, userObj);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer} bounces={false}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconBg}>
            <Text style={{ fontSize: 22 }}>♻️</Text>
          </View>
          <Text style={styles.brandTxt}>EcoCollect</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.formSection}>
        <Input
          label="EMAIL ADDRESS"
          value={email}
          onChangeText={setEmail}
          placeholder="name@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Text style={{ fontSize: 16, color: '#64748B' }}>👤</Text>}
        />

        <Input
          label="PASSWORD"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          leftIcon={<Text style={{ fontSize: 16, color: '#64748B' }}>🛡️</Text>}
        />

        <View style={styles.optionsRow}>
          <TouchableOpacity 
            style={styles.rememberBox} 
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkedBox]}>
              {rememberMe && <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900' }}>✓</Text>}
            </View>
            <Text style={styles.rememberTxt}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotTxt}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '600', marginBottom: 6 }}>⚠️ {error}</Text>}

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={submitting}
          disabled={submitting}
          style={{ marginTop: 8 }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.noAccountTxt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerTxt}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F4FCEB'
  },
  contentContainer: {
    paddingBottom: 40
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24
  },
  brandIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3
  },
  brandTxt: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500'
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: 520,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 10
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  rememberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981'
  },
  rememberTxt: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600'
  },
  forgotTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24
  },
  noAccountTxt: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500'
  },
  registerTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981'
  }
});
