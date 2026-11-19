import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Input } from '../../../common/Input/Input';
import { Button } from '../../../common/Button/Button';
import { useAuth } from '../../../store/auth/AuthContext';
import { authService } from '../../../services/auth.service';
import { UserRole } from '../../../../../shared/types';

export const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('priya@gmail.com');
  const [password, setPassword] = useState('password123');
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
      const userObj = await authService.login(email, password, selectedRole);
      login(selectedRole, userObj);
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
        <Text style={styles.subtitle}>Sign in to continue to your account</Text>

        {/* Role Toggle Selector */}
        <View style={styles.roleToggleRow}>
          <TouchableOpacity
            style={[styles.roleTab, selectedRole === 'customer' && styles.activeRoleTabCustomer]}
            onPress={() => {
              setSelectedRole('customer');
              setEmail('priya@gmail.com');
            }}
          >
            <Text style={[styles.roleTabTxt, selectedRole === 'customer' && styles.activeRoleTxt]}>
              👤 Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, selectedRole === 'picker' && styles.activeRoleTabPicker]}
            onPress={() => {
              setSelectedRole('picker');
              setEmail('suresh@ecocollect.lk');
            }}
          >
            <Text style={[styles.roleTabTxt, selectedRole === 'picker' && styles.activeRoleTxt]}>
              🚛 Collector
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formSection}>
        <Input
          label="EMAIL ADDRESS"
          value={email}
          onChangeText={setEmail}
          placeholder="priya@gmail.com"
          keyboardType="email-address"
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
            <View style={[styles.checkbox, rememberMe && (selectedRole === 'customer' ? styles.checkedBoxCustomer : styles.checkedBoxPicker)]}>
              {rememberMe && <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900' }}>✓</Text>}
            </View>
            <Text style={styles.rememberTxt}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.forgotTxt, { color: selectedRole === 'customer' ? '#10B981' : '#0284C7' }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '600', marginBottom: 4 }}>⚠️ {error}</Text>}

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={submitting}
          disabled={submitting}
          themeRole={selectedRole === 'picker' ? 'picker' : 'customer'}
          style={{ marginTop: 8 }}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTxt}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: '#EA4335' }}>G</Text>
            <Text style={styles.socialBtnTxt}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: '#1877F2' }}>f</Text>
            <Text style={styles.socialBtnTxt}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.noAccountTxt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerTxt, { color: selectedRole === 'customer' ? '#10B981' : '#0284C7' }]}>
              Register
            </Text>
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
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40
  },

  header: {
    marginBottom: 28
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
  },
  brandIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#BEF264',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  brandTxt: {
    fontSize: 24,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -0.4
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 14,
    color: '#256D38',
    fontWeight: '700',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 20
  },
  roleToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center'
  },
  activeRoleTabCustomer: {
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  activeRoleTabPicker: {
    backgroundColor: '#0284C7',
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  roleTabTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3F3F46'
  },
  activeRoleTxt: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  formSection: {
    width: '100%'
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4
  },
  rememberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkedBoxCustomer: {
    backgroundColor: '#10B981',
    borderColor: '#10B981'
  },
  checkedBoxPicker: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7'
  },
  rememberTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155'
  },
  forgotTxt: {
    fontSize: 13,
    fontWeight: '800'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9'
  },
  dividerTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    marginHorizontal: 16
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF'
  },
  socialBtnTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noAccountTxt: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600'
  },
  registerTxt: {
    fontSize: 14,
    fontWeight: '800'
  }
});


