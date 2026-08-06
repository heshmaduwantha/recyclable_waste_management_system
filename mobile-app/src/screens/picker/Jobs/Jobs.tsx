import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { mockPickupsList } from '../../../mock/pickups';

export const PickerJobs: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} bounces={false}>
      <Header title="Assigned Duty Jobs" subtitle="Pickup queue and route schedule" />

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.sectionTitle}>Active Queue ({mockPickupsList.length})</Text>
          </View>
        </View>

        {mockPickupsList.map((job) => (
          <Card key={job.id} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.id}>{job.id}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusTxt}>{job.status}</Text>
              </View>
            </View>

            <Text style={styles.customer}>{job.customerName}</Text>
            <Text style={styles.phoneTxt}>{job.customerPhone}</Text>
            <Text style={styles.address}>📍 {job.address.street}, {job.address.city}</Text>

            <TouchableOpacity 
              style={styles.detailBtn}
              onPress={() => navigation.navigate('PickerJobDetails', { jobId: job.id })}
              activeOpacity={0.8}
            >
              <Text style={styles.detailTxt}>View Details & Complete →</Text>
            </TouchableOpacity>
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
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  id: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94A3B8'
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    textTransform: 'capitalize'
  },
  customer: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A'
  },
  phoneTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    marginTop: 1
  },
  address: {
    fontSize: 13,
    color: '#475569',
    marginTop: 6,
    marginBottom: 14
  },
  detailBtn: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  detailTxt: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 13
  }
});

