import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking, Platform } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { locationService, AddressSearchResult } from '../../../services/location.service';
import { Ionicons } from '@expo/vector-icons';

export const PickerGPS: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('15/A Havelock Road, Colombo 05');
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Customer Doorstep & Collector Coordinates
  const customerLoc = { latitude: 6.8910, longitude: 79.8580 };
  const pickerLoc = { latitude: 6.8912, longitude: 79.8582 }; // Doorstep vicinity

  const proximity = locationService.verifyDoorstepProximity(pickerLoc, customerLoc);
  const etaMinutes = locationService.calculateRouteETA(1.2);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await locationService.searchAddress(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const openGoogleMaps = () => {
    const lat = customerLoc.latitude;
    const lng = customerLoc.longitude;
    const label = encodeURIComponent('Customer Doorstep - Kasun Perera');
    
    const googleMapsUrl = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`
    }) || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    Linking.openURL(googleMapsUrl).catch(() => {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Collector GPS Navigation" subtitle="Google Maps doorstep route & location verification" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Open Google Maps Hero Action Card */}
        <Card style={styles.gmapsHeroCard}>
          <View style={styles.gmapsHeaderRow}>
            <View style={styles.mapIconCircle}>
              <Text style={{ fontSize: 26 }}>📍</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.gmapsTitle}>Target Customer Doorstep</Text>
              <Text style={styles.gmapsAddress}>15/A Havelock Road, Colombo 05</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.openMapsBtn} onPress={openGoogleMaps} activeOpacity={0.85}>
            <Ionicons name="map" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.openMapsBtnTxt}>Open in Google Maps Navigation 🗺️</Text>
          </TouchableOpacity>
        </Card>

        {/* Address Search Input */}
        <Card style={styles.searchCard}>
          <Text style={styles.searchLabel}>SEARCH ADDRESS LOCATION</Text>
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

        {/* Proximity Verification Card */}
        <View style={styles.proximityCard}>
          <View style={styles.proximityHeaderRow}>
            <View style={styles.gpsIconBg}>
              <Ionicons name="navigate" size={24} color="#0284C7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.proximityTitle}>Doorstep Proximity Status</Text>
              <Text style={styles.proximitySub}>Distance: {proximity.distanceMeters} meters away · ETA {etaMinutes} mins</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, proximity.isWithinRange ? styles.badgeSuccess : styles.badgeWarning]}>
            <Text style={[styles.statusBadgeTxt, proximity.isWithinRange ? styles.badgeTxtSuccess : styles.badgeTxtWarning]}>
              {proximity.isWithinRange ? '✓ Within Doorstep Range (<= 50m)' : '⚠️ Out of Range (> 50m)'}
            </Text>
          </View>
        </View>

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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { paddingBottom: 40 },
  body: { padding: 20 },
  gmapsHeroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 4
  },
  gmapsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16
  },
  mapIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gmapsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  gmapsAddress: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38BDF8',
    marginTop: 2
  },
  openMapsBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  openMapsBtnTxt: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF'
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
  inputRow: { flexDirection: 'row', gap: 8 },
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
  searchingTxt: { fontSize: 12, fontWeight: '600', color: '#94A3B8', marginTop: 8 },
  resultsList: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 8 },
  resRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  resTxt: { fontSize: 12, color: '#334155', flex: 1 },
  proximityCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 20
  },
  proximityHeaderRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
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
  proximityTitle: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  proximitySub: { fontSize: 12, fontWeight: '600', color: '#0284C7', marginTop: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, alignItems: 'center' },
  badgeSuccess: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0' },
  badgeWarning: { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#F59E0B' },
  statusBadgeTxt: { fontSize: 12, fontWeight: '900' },
  badgeTxtSuccess: { color: '#059669' },
  badgeTxtWarning: { color: '#D97706' }
});
