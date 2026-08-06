import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export const PickerCameraUpload: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'batch' | 'scale' | 'qr'>('batch');
  const [photos, setPhotos] = useState<{ batch?: string; scale?: string; qr?: string }>({});

  const takePhoto = async (type: 'batch' | 'scale' | 'qr') => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Camera permission is required to capture verification photos.');
      return;
    }


    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotos((prev) => ({
        ...prev,
        [type]: result.assets[0].uri
      }));
    }
  };

  const isComplete = photos.batch || photos.scale || photos.qr;

  return (
    <View style={styles.container}>
      <Header title="Doorstep Photo Verification 📸" subtitle="Capture 3 required doorstep proof photos" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Verification Explanation Banner */}
        <Card style={styles.guideCard}>
          <Text style={styles.guideTitle}>📋 Doorstep Verification Process:</Text>
          <Text style={styles.guideText}>1. 📦 Take photo of sorted recyclables batch at doorstep.</Text>
          <Text style={styles.guideText}>2. ⚖️ Take photo of scale displaying measured weight.</Text>
          <Text style={styles.guideText}>3. 🏷️ Scan doorstep bin QR or house number tag.</Text>
        </Card>

        {/* 3 Photo Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'batch' && styles.activeTab]}
            onPress={() => setActiveTab('batch')}
          >
            <Text style={[styles.tabTxt, activeTab === 'batch' && styles.activeTabTxt]}>1. Batch {photos.batch ? '✓' : ''}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'scale' && styles.activeTab]}
            onPress={() => setActiveTab('scale')}
          >
            <Text style={[styles.tabTxt, activeTab === 'scale' && styles.activeTabTxt]}>2. Scale {photos.scale ? '✓' : ''}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'qr' && styles.activeTab]}
            onPress={() => setActiveTab('qr')}
          >
            <Text style={[styles.tabTxt, activeTab === 'qr' && styles.activeTabTxt]}>3. Bin QR {photos.qr ? '✓' : ''}</Text>
          </TouchableOpacity>
        </View>

        {/* Camera Viewfinder */}
        <View style={styles.viewfinderBox}>
          {photos[activeTab] ? (
            <Image source={{ uri: photos[activeTab] }} style={styles.previewImage} />
          ) : (
            <View style={styles.aimBox}>
              <Ionicons name="camera" size={54} color="#0284C7" />
              <Text style={styles.aimTxt}>
                {activeTab === 'batch'
                  ? 'Snap sorted waste batch at doorstep 📦'
                  : activeTab === 'scale'
                  ? 'Snap digital scale weight reading ⚖️'
                  : 'Snap doorstep bin QR / house tag 🏷️'}
              </Text>
            </View>
          )}

          {photos[activeTab] && (
            <View style={styles.verifiedTagOverlay}>
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagTxt}>✓ {activeTab.toUpperCase()} PHOTO CAPTURED</Text>
              </View>
            </View>
          )}
        </View>

        {/* Shutter Button */}
        <TouchableOpacity style={styles.shutterBtn} onPress={() => takePhoto(activeTab)} activeOpacity={0.8}>
          <View style={styles.innerShutter} />
        </TouchableOpacity>

        {/* Action Button */}
        <Button
          title="Submit Verification & Finish →"
          onPress={() => navigation.navigate('CollectionSuccess')}
          themeRole="picker"
          disabled={!isComplete}
          style={{ width: '100%', marginTop: 12 }}
        />
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  body: {
    flex: 1,
    padding: 20,
    alignItems: 'center'
  },
  guideCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 14,
    width: '100%'
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
    marginBottom: 4
  },
  guideText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 16
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 12
  },
  tabItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  activeTab: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7'
  },
  tabTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  activeTabTxt: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  viewfinderBox: {
    width: '100%',
    height: 260,
    backgroundColor: '#F0F9FF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },

  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    position: 'absolute'
  },
  verifiedTagOverlay: {
    position: 'absolute',
    bottom: 16
  },
  aimBox: {

    alignItems: 'center'
  },
  aimTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 12
  },
  previewBox: {
    alignItems: 'center'
  },
  verifiedTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12
  },
  verifiedTagTxt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  innerShutter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0284C7'
  }
});
