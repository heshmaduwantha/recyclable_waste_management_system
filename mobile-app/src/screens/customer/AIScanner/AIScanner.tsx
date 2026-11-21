import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { aiWasteDetectionService, AIDetectionResult } from '../../../services/ai.service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export const AIScanner: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<AIDetectionResult | null>(null);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Camera permission is required to scan waste.');
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const asset = pickerResult.assets[0];
      setCapturedImageUri(asset.uri);
      runAIDetection(asset.uri, asset.base64 || undefined);
    }
  };

  const openGallery = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const asset = pickerResult.assets[0];
      setCapturedImageUri(asset.uri);
      runAIDetection(asset.uri, asset.base64 || undefined);
    }
  };

  const runAIDetection = async (imageUri?: string, base64?: string, categoryOverride?: 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-Waste') => {
    setIsScanning(true);
    try {
      const detection = await aiWasteDetectionService.detectImage(imageUri, base64, categoryOverride);
      setResult(detection);
    } catch (error) {
      console.error(error);
      if (categoryOverride) {
        setResult(await aiWasteDetectionService.getMaterialForCategory(categoryOverride));
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleCategoryChange = async (cat: 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-Waste', customMaterial?: string) => {
    try {
      setResult(await aiWasteDetectionService.getMaterialForCategory(cat, customMaterial));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleWeightChange = (delta: number) => {
    if (!result) return;
    const newWeight = Math.max(0.5, parseFloat((result.estimatedWeightKg + delta).toFixed(1)));
    setResult({
      ...result,
      estimatedWeightKg: newWeight,
      estimatedPoints: Math.round(newWeight * (result.estimatedPoints / result.estimatedWeightKg))
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="AI Waste Scanner 🤖" subtitle="Scan item & verify material classification" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        {/* Scanner Viewfinder Box */}
        <View style={styles.viewfinderBox}>
          {capturedImageUri ? (
            <Image source={{ uri: capturedImageUri }} style={styles.capturedPhoto} />
          ) : null}

          <View style={styles.laserBeam} />

          {isScanning ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.scanningTxt}>Analyzing Item & Vision Features...</Text>
            </View>
          ) : result ? (
            <View style={styles.detectedBadgeOverlay}>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceTxt}>✓ {result.confidenceScore}% AI Match: {result.materialName}</Text>
              </View>
            </View>
          ) : !capturedImageUri ? (
            <View style={styles.idleFrame}>
              <Ionicons name="camera" size={54} color="#10B981" />
              <Text style={styles.idleTxt}>Tap button below to take or choose photo</Text>
            </View>
          ) : null}
        </View>

        {/* Action Buttons */}
        {!isScanning && (
          <View style={{ width: '100%', gap: 10, marginVertical: 10 }}>
            <Button
              title="📷 Take Photo to Scan"
              onPress={openCamera}
            />
            <Button
              title="🖼️ Choose from Gallery"
              onPress={openGallery}
              variant="outline"
            />
          </View>
        )}

        {/* Quick Material Presets Bar for Live Demo / Examination */}
        <View style={{ marginVertical: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', marginBottom: 6, letterSpacing: 0.5 }}>
            QUICK RECOGNITION (TAP TO TEST ANY REAL ITEM):
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {[
              { label: '💻 Laptop / PC', cat: 'E-Waste' as const, name: 'Laptop / Computing Device' },
              { label: '📱 Phone & Gadgets', cat: 'E-Waste' as const, name: 'Smartphone / Peripheral' },
              { label: '📦 Cardboard Box', cat: 'Paper' as const, name: 'Corrugated Cardboard Box' },
              { label: '🥤 Plastic Bottle', cat: 'Plastic' as const, name: 'PET Plastic Bottle' },
              { label: '🥫 Aluminum Can', cat: 'Metal' as const, name: 'Aluminum Beverage Can' },
              { label: '🍾 Glass Bottle', cat: 'Glass' as const, name: 'Glass Bottle / Jar' },
            ].map(p => (
              <TouchableOpacity
                key={p.label}
                onPress={() => handleCategoryChange(p.cat, p.name)}
                style={{
                  backgroundColor: result?.materialName === p.name ? '#ECFDF5' : '#FFFFFF',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: result?.materialName === p.name ? '#10B981' : '#E2E8F0',
                  elevation: 1
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '800', color: result?.materialName === p.name ? '#059669' : '#0F172A' }}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Override Selector */}
        {result && (
          <View style={styles.categorySelectorBox}>
            <Text style={styles.selectorTitle}>AI Material Category (Tap to Change):</Text>
            <View style={styles.pillRow}>
              {(['Plastic', 'Paper', 'Metal', 'Glass', 'E-Waste'] as const).map((cat) => {
                const isSelected = result.category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catPill, isSelected && styles.selectedCatPill]}
                    onPress={() => handleCategoryChange(cat)}
                  >
                    <Text style={[styles.catPillTxt, isSelected && styles.selectedCatPillTxt]}>
                      {cat === 'Plastic' ? '🧴' : cat === 'Paper' ? '📰' : cat === 'Metal' ? '🥫' : cat === 'Glass' ? '🫙' : '💻'} {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* AI Detection Result Summary Card */}
        {result && (
          <Card style={styles.resultCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.materialIconBg}>
                <Ionicons name="sparkles" size={24} color="#10B981" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.materialTitle}>{result.materialName}</Text>
                <Text style={styles.categorySub}>Rating: {result.recyclabilityRating} · {result.tips}</Text>
              </View>
            </View>

            {/* Interactive Weight Adjuster */}
            <View style={styles.adjusterRow}>
              <Text style={styles.adjusterLabel}>Item Weight:</Text>
              <View style={styles.stepperContainer}>
                <TouchableOpacity style={styles.stepBtn} onPress={() => handleWeightChange(-0.5)}>
                  <Text style={styles.stepBtnTxt}>−</Text>
                </TouchableOpacity>

                <Text style={styles.weightTxt}>{result.estimatedWeightKg} kg</Text>

                <TouchableOpacity style={styles.stepBtn} onPress={() => handleWeightChange(0.5)}>
                  <Text style={styles.stepBtnTxt}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Proceed to Pickup Request →"
              onPress={() =>
                navigation.navigate('CustomerPickup', {
                  category: result.category.toLowerCase(),
                  weight: result.estimatedWeightKg
                })
              }
              style={{ marginTop: 14 }}
            />
          </Card>
        )}
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
  stepBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0'
  },
  stepNumberTxt: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.8,
    marginBottom: 2
  },
  stepTitleTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
  },
  stepSubTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    marginTop: 2
  },
  capturedPhoto: {

    width: '100%',
    height: '100%',
    borderRadius: 26,
    position: 'absolute'
  },
  detectedBadgeOverlay: {
    position: 'absolute',
    bottom: 20
  },
  viewfinderBox: {

    width: '100%',
    height: 300,
    backgroundColor: '#ECFDF5',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  laserBeam: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#10B981',
    borderRadius: 1.5,
    shadowColor: '#10B981',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4
  },
  loadingOverlay: {
    alignItems: 'center'
  },
  scanningTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
    marginTop: 14
  },
  idleFrame: {
    alignItems: 'center',
    padding: 20
  },
  idleTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
    textAlign: 'center',
    marginTop: 12
  },
  detectedFrame: {
    alignItems: 'center'
  },
  confidenceBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12
  },
  confidenceTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900'
  },
  categorySelectorBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  selectorTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 10
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  catPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  selectedCatPill: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981'
  },
  catPillTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  selectedCatPillTxt: {
    color: '#047857',
    fontWeight: '900'
  },
  adjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginVertical: 10
  },
  adjusterLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  stepBtnTxt: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669'
  },
  weightTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    minWidth: 50,
    textAlign: 'center'
  },
  resultCard: {

    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  materialIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  materialTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A'
  },
  categorySub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14
  },
  statCol: {
    flex: 1,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900'
  },
  statSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2
  },
  vDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0'
  },
  tipBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F59E0B'
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706'
  },
  tipTxt: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 2,
    lineHeight: 17
  }
});
