import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Button } from '../../../common/Button/Button';

export const CustomerBadgeDetails: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const badge = route?.params?.badge;
  if (!badge) return null;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Badge Specification" subtitle="Eco achievement criteria & multipliers" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        <View style={styles.heroBadgeCard}>
          <Text style={styles.badgeIcon}>{badge.icon}</Text>
          <Text style={styles.badgeName}>{badge.name}</Text>
          <View style={styles.unlockedPill}>
            <Text style={styles.unlockedTxt}>{badge.isUnlocked ? `✓ Unlocked ${badge.unlockedAt || ''}` : `🔒 ${badge.progressKg ?? 0} / ${badge.requiredRecycledKg} kg`}</Text>
          </View>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>CRITERIA</Text>
          <Text style={styles.infoVal}>{badge.criteria || badge.description}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>PERKS & MULTIPLIERS</Text>
          <Text style={styles.infoVal}>{badge.perksAndMultipliers || '—'}</Text>
        </View>

        <Button title="Got It" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
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
  heroBadgeCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 24
  },
  badgeIcon: {
    fontSize: 64,
    marginBottom: 12
  },
  badgeName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  unlockedPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12
  },
  unlockedTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  infoGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 1,
    marginBottom: 4
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20
  }
});
