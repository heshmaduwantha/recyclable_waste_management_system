import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { Ionicons } from '@expo/vector-icons';

export const CustomerSavedAddresses: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [addresses] = useState([
    { id: '1', title: 'Home Address', street: '45 Ward Place', city: 'Colombo 07', isDefault: true },
    { id: '2', title: 'Office / Business', street: '78 Duplication Road', city: 'Colombo 03', isDefault: false }
  ]);

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

        {addresses.map((addr) => (
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
              </View>

              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="create-outline" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <Button title="+ Add New Address" onPress={() => {}} style={{ marginTop: 16 }} />
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
