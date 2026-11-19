import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from '../../../common/Input/Input';
import { Button } from '../../../common/Button/Button';
import { useAuth } from '../../../store/auth/AuthContext';
import { authService } from '../../../services/auth.service';
import { locationService } from '../../../services/location.service';
import { Ionicons } from '@expo/vector-icons';

export const Register: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Doorstep Location Details
  const [houseNumber, setHouseNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  const fetchGpsLocation = async () => {
    setIsFetchingGps(true);
    try {
      // Simulate reverse geocoding current GPS coordinates
      const addr = await locationService.reverseGeocode(6.9147, 79.8653);
      setHouseNumber('No. 45/A');
      setStreetAddress('Ward Place, Colombo 07');
      setLandmark('Near Town Hall');
    } catch (error) {
      console.warn(error);
    } finally {
      setIsFetchingGps(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('Name, email and password are required.');
      return;
    }
    const parts = streetAddress.split(',').map((p) => p.trim()).filter(Boolean);
    const city = parts.length > 1 ? parts.pop()! : '';
    setSubmitting(true);
    setError(null);
    try {
      const created = await authService.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'customer',
        address: { street: `${houseNumber} ${parts.join(', ')}`.trim(), city, zipCode: '' }
      });
      login('customer', created);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer} bounces={false}>
      {/* Top Emerald Green Hero Header */}
      <View style={styles.heroHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Create Account 🚀</Text>
        <Text style={styles.heroSub}>Join EcoCollect as an Eco-Conscious Citizen</Text>
      </View>

      {/* Form Container */}
      <View style={styles.formCard}>
        <Text style={styles.sectionHeading}>PERSONAL DETAILS</Text>
        <Input
          label="FULL NAME"
          value={name}
          onChangeText={setName}
          placeholder="Priya Sharma"
          leftIcon={<Text style={{ fontSize: 16 }}>👤</Text>}
        />
        <Input
          label="EMAIL ADDRESS"
          value={email}
          onChangeText={setEmail}
          placeholder="priya@gmail.com"
          keyboardType="email-address"
          leftIcon={<Text style={{ fontSize: 16 }}>✉️</Text>}
        />
        <Input
          label="MOBILE PHONE"
          value={phone}
          onChangeText={setPhone}
          placeholder="+94 77 123 4567"
          keyboardType="phone-pad"
          leftIcon={<Text style={{ fontSize: 16 }}>📱</Text>}
        />
        <Input
          label="PASSWORD"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          leftIcon={<Text style={{ fontSize: 16 }}>🛡️</Text>}
        />

        {/* Doorstep Location Details */}
        <View style={styles.locationHeaderRow}>
          <Text style={styles.sectionHeading}>DOORSTEP COLLECTION ADDRESS</Text>
          <TouchableOpacity style={styles.gpsFetchBtn} onPress={fetchGpsLocation} disabled={isFetchingGps}>
            {isFetchingGps ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <>
                <Ionicons name="navigate" size={14} color="#10B981" />
                <Text style={styles.gpsFetchTxt}>Fetch GPS</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Input
          label="HOUSE / BUILDING NUMBER"
          value={houseNumber}
          onChangeText={setHouseNumber}
          placeholder="e.g. No. 45/A or Flat 3B"
          leftIcon={<Text style={{ fontSize: 16 }}>🏠</Text>}
        />
        <Input
          label="STREET NAME & AREA / CITY"
          value={streetAddress}
          onChangeText={setStreetAddress}
          placeholder="e.g. Ward Place, Colombo 07"
          leftIcon={<Text style={{ fontSize: 16 }}>📍</Text>}
        />
        <Input
          label="NEARBY LANDMARK"
          value={landmark}
          onChangeText={setLandmark}
          placeholder="e.g. Opposite Cargills Food City"
          leftIcon={<Text style={{ fontSize: 16 }}>🏢</Text>}
        />

        {error && <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '600', marginTop: 12 }}>⚠️ {error}</Text>}

        <Button
          title="Complete Registration & Sign In 🚀"
          onPress={handleRegister}
          loading={submitting}
          disabled={submitting}
          themeRole="customer"
          style={{ marginTop: 20 }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.noAccountTxt}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginTxt}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  contentContainer: {
    flexGrow: 1
  },
  heroHeader: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#10B981'
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 4
  },
  formCard: {
    flex: 1,
    marginTop: -24,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 6
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  gpsFetchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  gpsFetchTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669'
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
    fontWeight: '600'
  },
  loginTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981'
  }
});


