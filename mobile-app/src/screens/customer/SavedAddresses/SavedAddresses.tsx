import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { Input } from '../../../common/Input/Input';
import { Ionicons } from '@expo/vector-icons';
import { useApiData } from '../../../hooks/useApiData';
import { customerService } from '../../../services/customer.service';

export const CustomerSavedAddresses: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { data: addresses, error, reload } = useApiData(customerService.addresses, []);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await reload();
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  const handleAdd = async () => {
    if (!title.trim() || !street.trim() || !city.trim()) {
      setFormError('Title, street and city are required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await customerService.addAddress({ title: title.trim(), street: street.trim(), city: city.trim() });
      setTitle(''); setStreet(''); setCity('');
      setShowForm(false);
      await reload();
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Saved Addresses" subtitle="Manage doorstep collection locations" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Your Pickup Locations</Text>
          </View>
        </View>

        {error && <Text style={{ color: '#DC2626' }}>⚠️ {error}</Text>}
        {(addresses || []).map((addr) => (
          <Card key={addr.id} style={styles.addrCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.iconBg}>
                <Ionicons name="location" size={22} color="#10B981" />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.addrTitle}>{addr.title}</Text>
                  {addr.isDefault && (
                    <View style={styles.defaultPill}>
                      <Text style={styles.defaultTxt}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.streetTxt}>{addr.street}, {addr.city}</Text>
                {!addr.isDefault && (
                  <TouchableOpacity onPress={() => run(() => customerService.setDefaultAddress(addr.id))}>
                    <Text style={{ color: '#10B981', fontWeight: '700', marginTop: 6 }}>Set as default</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={styles.editBtn} onPress={() => run(() => customerService.deleteAddress(addr.id))}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {showForm && (
          <Card style={styles.addrCard}>
            <Input label="LABEL" value={title} onChangeText={setTitle} placeholder="e.g. Home, Office" />
            <Input label="STREET" value={street} onChangeText={setStreet} placeholder="45 Ward Place" />
            <Input label="CITY" value={city} onChangeText={setCity} placeholder="Colombo 07" />
            {formError && <Text style={{ color: '#DC2626', fontWeight: '600' }}>⚠️ {formError}</Text>}
            <Button title="Save Address" onPress={handleAdd} loading={saving} disabled={saving} style={{ marginTop: 8 }} />
          </Card>
        )}

        <Button
          title={showForm ? 'Cancel' : '+ Add New Address'}
          variant={showForm ? 'outline' : 'primary'}
          onPress={() => setShowForm(!showForm)}
          style={{ marginTop: 16 }}
        />
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  titleAccentBar: {
    width: 4,
    height: 18,
    borderRadius: 2
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  addrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center'
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  addrTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
  },
  defaultPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  defaultTxt: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669'
  },
  streetTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2
  },
  editBtn: {
    padding: 6
  }
});
