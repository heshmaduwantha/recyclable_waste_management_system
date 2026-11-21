import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Button } from '../../../common/Button/Button';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export const PickerCamera: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const openRealCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Camera permission is required to capture photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Photo Proof" subtitle="Capture doorstep waste batch photo" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.viewfinder}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="camera-outline" size={64} color="#0284C7" />
            <Text style={styles.txt}>Tap button below to open real device camera</Text>
          </View>
        )}
      </View>

      {!photoUri ? (
        <TouchableOpacity style={styles.snapBtn} onPress={openRealCamera} activeOpacity={0.8}>
          <View style={styles.innerSnap} />
        </TouchableOpacity>
      ) : (
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 10 }}>
          <Button
            title="Use This Photo ✓"
            onPress={() => navigation.navigate('PickerWeight', { photoUri })}
            themeRole="picker"
          />
          <Button title="Retake Photo 📷" onPress={openRealCamera} variant="outline" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  viewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    margin: 20,
    borderRadius: 24,
    borderStyle: 'dashed',
    backgroundColor: '#F0F9FF',
    overflow: 'hidden',
    position: 'relative'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22
  },
  txt: {
    color: '#0284C7',
    marginTop: 12,
    fontWeight: '700',
    fontSize: 14
  },
  snapBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#0284C7',
    alignSelf: 'center',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerSnap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0284C7'
  }
});
