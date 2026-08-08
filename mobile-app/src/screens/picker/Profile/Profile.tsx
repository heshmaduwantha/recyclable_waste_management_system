import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { useAuth } from '../../../store/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const PickerProfile: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const pickerDisplayName = user?.name || 'Suresh Kumar';
  const pickerInitials = pickerDisplayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SK';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Collector Profile" subtitle="Vehicle & shift credentials" />

      <View style={styles.body}>
        {/* Sky Blue Collector Hero Card */}
        <View style={styles.profileHeroCard}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarTxt}>{pickerInitials}</Text>
            <View style={styles.onlineBadgeDot} />
          </View>

          <Text style={styles.userName}>{pickerDisplayName}</Text>
          <Text style={styles.roleTitle}>Verified Eco Collector 🚛</Text>
          <Text style={styles.userPhone}>{user?.phone || '+94 71 987 6543'}</Text>

          {/* Rating & Badge Row */}
          <View style={styles.badgeRow}>
            <View style={styles.ratingPill}>
              <Text style={{ fontSize: 14, marginRight: 4 }}>⭐</Text>
              <Text style={styles.ratingValTxt}>4.9 Rating</Text>
            </View>

            <View style={styles.vehiclePill}>
              <Text style={styles.vehicleTxt}>Truck WP-5842</Text>
            </View>
          </View>
        </View>

        {/* 3 Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#0284C7' }]}>48</Text>
            <Text style={styles.metricLabel}>Done</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#10B981' }]}>142 kg</Text>
            <Text style={styles.metricLabel}>Collected</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#F59E0B' }]}>98%</Text>
            <Text style={styles.metricLabel}>On Time</Text>
          </View>
        </View>

        {/* Section Title with Accent Bar */}
        <View style={styles.sectionTitleRow}>
          <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
          <Text style={styles.sectionTitle}>Account & Operations</Text>
        </View>

        <View style={styles.optionsGroup}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={logout}
            activeOpacity={0.8}
          >
            <View style={[styles.optionIconBg, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.optionTitle, { color: '#EF4444' }]}>Log Out</Text>
              <Text style={styles.optionSub}>Sign out of collector portal</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF'
  },
  contentContainer: {
    paddingBottom: 40
  },
  body: {
    padding: 20
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0284C7',
    borderWidth: 2,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12
  },
  avatarTxt: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2
  },
  userPhone: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16
  },
  ratingPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0F172A'
  },
  ratingValTxt: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706'
  },
  vehiclePill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#0F172A'
  },
  vehicleTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1'
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900'
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14
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
  optionsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 14
  },
  optionIconBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  optionSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1
  }
});

