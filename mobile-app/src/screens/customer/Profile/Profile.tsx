import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { useAuth } from '../../../store/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useApiData } from '../../../hooks/useApiData';
import { customerService } from '../../../services/customer.service';

export const CustomerProfile: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { data, error } = useApiData(() => Promise.all([customerService.profile(), customerService.badges(), customerService.wallet()]), [user?.id]);
  const [profile, badges, wallet] = data || [null, [], null];
  const userDisplayName = profile?.name || user?.name || '';
  const initials = userDisplayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="My Account" subtitle="Recycler profile & eco rewards status" greenTheme />

      <View style={styles.body}>
        {/* Profile Card with Vibrant Emerald Tint & Avatar */}
        <View style={styles.profileHeroCard}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarTxt}>{initials}</Text>
            <View style={styles.onlineBadgeDot} />
          </View>

          <Text style={styles.userName}>{userDisplayName}</Text>
          <Text style={styles.userEmail}>{profile?.email || user?.email}</Text>
          <Text style={styles.userPhone}>{profile?.phone || user?.phone}</Text>

          {/* Prominent Eco Points Badge Chip */}
          <View style={styles.pointsChipRow}>
            <View style={styles.pointsPill}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>⭐</Text>
              <Text style={styles.pointsValTxt}>{(wallet?.totalPoints ?? 0).toLocaleString()} Eco Points</Text>
            </View>

            <View style={styles.tierPill}>
              <Text style={styles.tierPillTxt}>{profile?.badgePillTxt}</Text>
            </View>
          </View>
        </View>

        {/* 3 Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#10B981' }]}>{profile?.recycledKg ?? 0} kg</Text>
            <Text style={styles.metricLabel}>Recycled</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#0284C7' }]}>{profile?.completedPickups ?? 0}</Text>
            <Text style={styles.metricLabel}>Pickups</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#F59E0B' }]}>{profile?.cityRank ? `#${profile.cityRank}` : '—'}</Text>
            <Text style={styles.metricLabel}>City Rank</Text>
          </View>
        </View>

        {/* Section Title with Colored Accent Bar */}
        <View style={styles.sectionTitleRow}>
          <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
          <Text style={styles.sectionTitle}>Eco Badges & Rewards</Text>
        </View>

        <View style={styles.badgesGrid}>
          {error && <Text style={{ color: '#DC2626' }}>⚠️ {error}</Text>}
          {badges.map((badge) => (
            <TouchableOpacity key={badge.id} activeOpacity={0.85} onPress={() => navigation?.navigate('BadgeDetails', { badge })}>
            <Card style={styles.badgeCard}>
              <View style={{ opacity: badge.isUnlocked ? 1 : 0.45, alignItems: 'center' }}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDesc}>{badge.isUnlocked ? badge.description : `${badge.progressKg ?? 0} / ${badge.requiredRecycledKg} kg`}</Text>
              </View>
            </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section Title with Colored Accent Bar */}
        <View style={styles.sectionTitleRow}>
          <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
          <Text style={styles.sectionTitle}>Account Options</Text>
        </View>

        {/* Settings Action List */}
        <View style={styles.optionsGroup}>
          {[
            { label: 'Edit Profile', sub: 'Name, email & phone', icon: 'person-outline', screen: 'EditProfile' },
            { label: 'Saved Addresses', sub: 'Doorstep pickup locations', icon: 'location-outline', screen: 'SavedAddresses' },
            { label: 'Recycling History', sub: 'All your pickup requests', icon: 'time-outline', screen: 'History' }
          ].map((o) => (
            <TouchableOpacity key={o.screen} style={styles.optionRow} onPress={() => navigation?.navigate(o.screen)} activeOpacity={0.8}>
              <View style={[styles.optionIconBg, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name={o.icon as any} size={20} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>{o.label}</Text>
                <Text style={styles.optionSub}>{o.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
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
              <Text style={styles.optionSub}>Sign out of your account</Text>
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
    backgroundColor: '#F4FCEB'
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
    borderColor: '#18181B',
    shadowColor: '#18181B',
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
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12
  },
  avatarTxt: {
    fontSize: 24,
    fontWeight: '900',
    color: '#D97706'
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
    color: '#18181B',
    letterSpacing: -0.4
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3F3F46',
    marginTop: 2
  },
  userPhone: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2
  },
  pointsChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16
  },
  pointsPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  pointsValTxt: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D97706'
  },
  tierPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  tierPillTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
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
    borderColor: '#18181B',
    shadowColor: '#18181B',
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
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24
  },
  badgeCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  badgeIcon: {
    fontSize: 30,
    marginBottom: 6
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center'
  },
  badgeDesc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2
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

