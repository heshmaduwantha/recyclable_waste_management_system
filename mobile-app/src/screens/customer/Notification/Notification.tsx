import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Ionicons } from '@expo/vector-icons';
import { notificationService, AppNotification } from '../../../services/notification.service';

export const CustomerNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifs();
  }, []);

  async function loadNotifs() {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifs();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bounces={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
    >
      <Header title="Notifications" subtitle="Real-time updates on pickups & eco rewards" greenTheme />

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Live Activity Notifications</Text>
          </View>
        </View>

        {notifications.length > 0 ? (
          notifications.map((item) => {
            const isAccepted = item.title.includes('Accepted');
            const isCompleted = item.title.includes('Completed') || item.title.includes('Credited');
            const isAssigned = item.title.includes('Assigned') || item.title.includes('Allocated');

            const iconName = isCompleted ? 'star-outline' : isAccepted ? 'car-outline' : isAssigned ? 'truck-outline' : 'notifications-outline';
            const iconColor = isCompleted ? '#D97706' : isAccepted ? '#0284C7' : isAssigned ? '#10B981' : '#64748B';
            const iconBg = isCompleted ? '#FEF3C7' : isAccepted ? '#E0F2FE' : isAssigned ? '#ECFDF5' : '#F1F5F9';

            return (
              <Card key={item.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={[styles.iconBg, { backgroundColor: iconBg }]}>
                    <Ionicons name={iconName as any} size={22} color={iconColor} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.cardTop}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.time}>{item.timestamp}</Text>
                    </View>
                    <Text style={styles.msg}>{item.message}</Text>
                  </View>
                </View>
              </Card>
            );
          })
        ) : (
          <Text style={styles.emptyTxt}>No activity notifications yet. Pull down to refresh.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { paddingBottom: 40 },
  body: { padding: 20 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  titleGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleAccentBar: { width: 4, height: 18, borderRadius: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#0F172A', letterSpacing: -0.3 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  cardRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  iconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  time: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  msg: { fontSize: 13, color: '#475569', lineHeight: 18 },
  emptyTxt: { textAlign: 'center', color: '#94A3B8', marginTop: 30, fontSize: 13 }
});
