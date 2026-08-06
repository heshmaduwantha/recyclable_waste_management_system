import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { locationService, AddressSearchResult } from '../../../services/location.service';
import { Ionicons } from '@expo/vector-icons';

export const PickerGPS: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('45 Ward Place, Colombo');
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simulated Picker & Customer Locations
  const customerLoc = { latitude: 6.9147, longitude: 79.8653 };
  const pickerLoc = { latitude: 6.9148, longitude: 79.8654 }; // ~18 meters away

  const proximity = locationService.verifyDoorstepProximity(pickerLoc, customerLoc);
  const etaMinutes = locationService.calculateRouteETA(1.2);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await locationService.searchAddress(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="GPS & Route Verification" subtitle="Doorstep proximity & Nominatim geocoding" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* OpenStreetMap Address Search Input */}
        <Card style={styles.searchCard}>
          <Text style={styles.searchLabel}>SEARCH ADDRESS (OPENSTREETMAP NOMINATIM)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search address or landmark..."
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Ionicons name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {isSearching && <Text style={styles.searchingTxt}>Geocoding address...</Text>}

          {searchResults.length > 0 && (
            <View style={styles.resultsList}>
              {searchResults.map((res) => (
                <TouchableOpacity key={res.place_id} style={styles.resRow} onPress={() => setSearchResults([])}>
                  <Ionicons name="location" size={16} color="#0284C7" style={{ marginRight: 6 }} />
                  <Text style={styles.resTxt} numberOfLines={2}>{res.display_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>

        {/* Haversine Doorstep Proximity Verification Card */}
        <View style={styles.proximityCard}>
          <View style={styles.proximityHeaderRow}>
            <View style={styles.gpsIconBg}>
              <Ionicons name="navigate" size={24} color="#0284C7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.proximityTitle}>Doorstep GPS Verification</Text>
              <Text style={styles.proximitySub}>Haversine distance: {proximity.distanceMeters} meters away</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, proximity.isWithinRange ? styles.badgeSuccess : styles.badgeWarning]}>
            <Text style={[styles.statusBadgeTxt, proximity.isWithinRange ? styles.badgeTxtSuccess : styles.badgeTxtWarning]}>
              {proximity.isWithinRange ? '✓ Within Doorstep Range (<= 50m)' : '⚠️ Out of Range (> 50m)'}
            </Text>
          </View>
        </View>

        {/* Route Graphic & ETA Card */}
        <Card style={styles.mapCard}>
          <View style={styles.mapInner}>
            <Text style={{ fontSize: 52 }}>🗺️</Text>
            <Text style={styles.mapTitle}>Route to Customer Location</Text>
            <Text style={styles.etaTxt}>Estimated Travel Time: {etaMinutes} mins (1.2 km)</Text>
          </View>
        </Card>

        <Button
          title="Confirm Arrival at Doorstep →"
          onPress={() => navigation.navigate('PickerWeight')}
          themeRole="picker"
          style={{ marginTop: 8 }}
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
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  searchLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.8,
    marginBottom: 8
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A'
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchingTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 8
  },
  resultsList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8
  },
  resRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  resTxt: {
    fontSize: 12,
    color: '#334155',
    flex: 1
  },
  proximityCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 20
  },
  proximityHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  gpsIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD'
  },
  proximityTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
  },
  proximitySub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    marginTop: 1
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center'
  },
  badgeSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B'
  },
  statusBadgeTxt: {
    fontSize: 12,
    fontWeight: '900'
  },
  badgeTxtSuccess: {
    color: '#059669'
  },
  badgeTxtWarning: {
    color: '#D97706'
  },
  mapCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  mapInner: {
    alignItems: 'center'
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 8
  },
  etaTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginTop: 4
  }
});

