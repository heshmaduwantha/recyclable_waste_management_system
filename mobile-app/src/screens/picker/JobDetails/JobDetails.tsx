import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { Ionicons } from '@expo/vector-icons';

export const PickerJobDetails: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Job Specification" subtitle="Verification & doorstep collection details" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Customer Information Hero Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerTopRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarTxt}>KP</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>Kasun Perera</Text>
              <Text style={styles.phoneTxt}>+94 77 123 4567</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={18} color="#0284C7" />
            </TouchableOpacity>
          </View>

          <View style={styles.addressBox}>
            <Ionicons name="location" size={18} color="#0284C7" style={{ marginRight: 8 }} />
            <Text style={styles.addressTxt}>15/A Havelock Road, Colombo 05 (1.2 km away)</Text>
          </View>
        </View>

        {/* Section Header with Accent Bar */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Declared Recyclables</Text>
          </View>
        </View>

        <Card style={styles.itemsCard}>
          {[
            { category: 'Plastic (PET Bottles)', est: '10.0 kg', rate: 'LKR 120/kg', icon: '🧴' },
            { category: 'Paper & Cardboard', est: '5.0 kg', rate: 'LKR 60/kg', icon: '📰' }
          ].map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={{ fontSize: 24, marginRight: 10 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemCategoryTxt}>{item.category}</Text>
                <Text style={styles.itemRateTxt}>{item.rate}</Text>
              </View>
              <View style={styles.estBadge}>
                <Text style={styles.estBadgeTxt}>Est: {item.est}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Action Button */}
        <Button
          title="Proceed to Doorstep Weight Scale ⚖️"
          onPress={() => navigation.navigate('PickerWeight')}
          themeRole="picker"
          style={{ marginTop: 12 }}
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
  customerCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 24
  },
  customerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  customerName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A'
  },
  phoneTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 1
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  addressTxt: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 18
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
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
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  itemCategoryTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  itemRateTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2
  },
  estBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  estBadgeTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669'
  }
});

