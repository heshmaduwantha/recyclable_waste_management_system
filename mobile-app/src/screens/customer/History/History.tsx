import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { mockPickupsList } from '../../../mock/pickups';
import { Ionicons } from '@expo/vector-icons';

export const CustomerHistory: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Recycling History" subtitle="Archive of past pickup requests & eco rewards" greenTheme />

      <View style={styles.body}>
        {/* Eco Lifetime Hero Card */}
        <View style={styles.summaryHeroCard}>
          <Text style={styles.summaryTitle}>Lifetime Environmental Impact</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#10B981' }]}>43.4 kg</Text>
              <Text style={styles.metricSub}>Recycled</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#0284C7' }]}>8</Text>
              <Text style={styles.metricSub}>Pickups</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: '#D97706' }]}>+2,450</Text>
              <Text style={styles.metricSub}>Eco Points</Text>
            </View>
          </View>
        </View>

        {/* Section Header with Accent Bar */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Past Pickup Log</Text>
          </View>
          <Text style={styles.totalCountTxt}>{mockPickupsList.length} completed</Text>
        </View>

        {/* Pickup Request History Cards */}
        {mockPickupsList.map((pickup, idx) => (
          <Card key={pickup.id || idx} style={styles.historyCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.iconBg}>
                <Ionicons name="leaf-outline" size={22} color="#10B981" />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.idRow}>
                  <Text style={styles.idTxt}>{pickup.id}</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusTxt}>● {pickup.status}</Text>
                  </View>
                </View>
                <Text style={styles.addressTxt}>{pickup.address.street}, {pickup.address.city}</Text>
                <Text style={styles.dateTimeTxt}>{pickup.scheduledDate} · {pickup.scheduledTimeSlot}</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.weightTxt}>{pickup.totalEstimatedWeight} kg</Text>
                <Text style={styles.pointsTxt}>+{pickup.earnedPoints || pickup.estimatedPoints} pts</Text>
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
  summaryHeroCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 24
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 14
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  metricCol: {
    alignItems: 'center',
    flex: 1
  },
  metricVal: {
    fontSize: 19,
    fontWeight: '900'
  },
  metricSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    marginTop: 2
  },
  vDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#A7F3D0'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  totalCountTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981'
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
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
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  idTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8'
  },
  statusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  statusTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'capitalize'
  },
  addressTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  dateTimeTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1
  },
  weightTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
  },
  pointsTxt: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
    marginTop: 2
  }
});

