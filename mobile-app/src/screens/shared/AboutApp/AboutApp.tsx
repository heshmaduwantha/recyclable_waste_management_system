import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';

export const AboutApp: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="About EcoCollect" subtitle="Mission, vision & environmental impact" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        {/* Brand Card */}
        <View style={styles.brandCard}>
          <Text style={{ fontSize: 54 }}>♻️</Text>
          <Text style={styles.brandName}>EcoCollect</Text>
          <Text style={styles.versionTxt}>Version 1.0.0 (Build 540)</Text>

          <Text style={styles.missionTxt}>
            EcoCollect is an AI-powered recyclable waste management platform empowering citizens to digitize waste collection, eliminate landfill waste, and earn eco rewards.
          </Text>
        </View>

        {/* Stats Grid */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>GLOBAL IMPACT METRICS</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: '#10B981' }]}>120+ Tons</Text>
              <Text style={styles.statSub}>Recycled</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: '#0284C7' }]}>50,000+</Text>
              <Text style={styles.statSub}>Citizens</Text>
            </View>
          </View>
        </Card>
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
  brandCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 24
  },
  brandName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginTop: 8
  },
  versionTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 2,
    marginBottom: 14
  },
  missionTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  statsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 12
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statCol: {
    alignItems: 'center'
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900'
  },
  statSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2
  }
});
