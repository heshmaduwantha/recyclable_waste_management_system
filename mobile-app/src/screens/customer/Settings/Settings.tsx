import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Ionicons } from '@expo/vector-icons';

export const CustomerSettings: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [notifs, setNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Settings" subtitle="App preferences & notifications" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
        </View>

        <View style={styles.group}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Push Notifications</Text>
              <Text style={styles.rowSub}>Alerts for driver arrival & points credited</Text>
            </View>
            <Switch value={notifs} onValueChange={setNotifs} trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }} thumbColor={notifs ? '#10B981' : '#F1F5F9'} />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>SMS Reminders</Text>
              <Text style={styles.rowSub}>Text updates before scheduled pickup</Text>
            </View>
            <Switch value={smsAlerts} onValueChange={setSmsAlerts} trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }} thumbColor={smsAlerts ? '#10B981' : '#F1F5F9'} />
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.sectionTitle}>App Preferences</Text>
          </View>
        </View>

        <View style={styles.group}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Dark Appearance</Text>
              <Text style={styles.rowSub}>Toggle dark theme UI mode</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#CBD5E1', true: '#93C5FD' }} thumbColor={darkMode ? '#0284C7' : '#F1F5F9'} />
          </View>

          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('SavedAddresses')}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Saved Doorstep Addresses</Text>
              <Text style={styles.rowSub}>Manage collection locations</Text>
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
    marginBottom: 14
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
  group: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  rowSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2
  }
});
