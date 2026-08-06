import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Ionicons } from '@expo/vector-icons';

export const CustomerNotification: React.FC = () => {
  const notifs = [
    { id: 1, icon: 'car-outline', color: '#0284C7', bg: '#E0F2FE', title: 'Pickup Driver En Route', msg: 'Collector Suresh is on his way to your location (1.2 km away).', time: '10m ago' },
    { id: 2, icon: 'star-outline', color: '#D97706', bg: '#FEF3C7', title: '+340 Points Credited', msg: 'Your batch PU-8820 was verified and points added to your Eco Wallet.', time: '2h ago' },
    { id: 3, icon: 'checkmark-circle-outline', color: '#10B981', bg: '#ECFDF5', title: 'Pickup Confirmed', msg: 'Your scheduled recycling collection for tomorrow at 8:00 AM is confirmed.', time: '1d ago' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Notifications" subtitle="Real-time updates on pickups & eco rewards" greenTheme />

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Recent Activity Notifications</Text>
          </View>
        </View>

        {notifs.map((item) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBg, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.cardTop}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.msg}>{item.msg}</Text>
              </View>
            </View>
          </Card>
        ))}
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start'
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  time: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8'
  },
  msg: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18
  }
});

