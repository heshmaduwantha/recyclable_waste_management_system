import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Button } from '../../../common/Button/Button';
import { usePickup } from '../../../store/pickup/PickupContext';
import { WasteCategory } from '../../../../../shared/types';

interface MaterialDef {
  id: WasteCategory;
  label: string;
  icon: string;
  unitPrice: number; // LKR per kg
  ptsPerKg: number;  // Eco points per kg
}

export const CustomerPickup: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const { createPickup } = usePickup();

  const materials: MaterialDef[] = [
    { id: 'plastic', label: 'Plastic', icon: '🧴', unitPrice: 120, ptsPerKg: 50 },
    { id: 'glass', label: 'Glass', icon: '🫙', unitPrice: 40, ptsPerKg: 20 },
    { id: 'metal', label: 'Metal', icon: '🥫', unitPrice: 250, ptsPerKg: 100 },
    { id: 'polythene', label: 'Polythene', icon: '🛍️', unitPrice: 80, ptsPerKg: 30 },
    { id: 'paper', label: 'Paper', icon: '📰', unitPrice: 60, ptsPerKg: 25 },
    { id: 'e-waste', label: 'E-Waste', icon: '💻', unitPrice: 400, ptsPerKg: 200 }
  ];

  // Map of category -> weight in kg
  const [itemWeights, setItemWeights] = useState<{ [key in WasteCategory]?: number }>({
    plastic: 2.0,
    paper: 1.5
  });

  // Pre-fill scanned item from AI Scanner route params
  React.useEffect(() => {
    const scannedCategory = route?.params?.category as WasteCategory;
    const scannedWeight = route?.params?.weight as number;

    if (scannedCategory) {
      setItemWeights((prev) => ({
        ...prev,
        [scannedCategory]: scannedWeight || 2.5
      }));
    }
  }, [route?.params]);


  const [address, setAddress] = useState('123 Galle Road, Colombo 05, Sri Lanka');

  const selectedCategories = Object.keys(itemWeights).filter(
    (key) => (itemWeights[key as WasteCategory] || 0) > 0
  ) as WasteCategory[];

  const toggleMaterial = (id: WasteCategory) => {
    setItemWeights((prev) => {
      const current = prev[id] || 0;
      if (current > 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      } else {
        return { ...prev, [id]: 1.5 };
      }
    });
  };

  const updateWeight = (id: WasteCategory, delta: number) => {
    setItemWeights((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0.5, parseFloat((current + delta).toFixed(1)));
      return { ...prev, [id]: updated };
    });
  };

  const setExactWeight = (id: WasteCategory, value: string) => {
    const num = parseFloat(value);
    setItemWeights((prev) => ({
      ...prev,
      [id]: isNaN(num) ? 0 : num
    }));
  };

  // Grand Summary Calculations
  let totalWeight = 0;
  let totalCash = 0;
  let totalPoints = 0;

  selectedCategories.forEach((cat) => {
    const mat = materials.find((m) => m.id === cat);
    const weight = itemWeights[cat] || 0;
    if (mat && weight > 0) {
      totalWeight += weight;
      totalCash += weight * mat.unitPrice;
      totalPoints += Math.round(weight * mat.ptsPerKg);
    }
  });

  const handleSubmit = async () => {
    await createPickup({
      items: selectedCategories.map((cat) => {
        const mat = materials.find((m) => m.id === cat);
        return {
          category: cat,
          estimatedWeightKg: itemWeights[cat] || 1.0,
          pricePerKg: mat?.unitPrice || 50
        };
      }),
      totalEstimatedWeight: parseFloat(totalWeight.toFixed(1)),
      scheduledDate: 'Tomorrow',
      scheduledTimeSlot: '09:00 AM - 11:00 AM',
      address: { street: address, city: 'Colombo', latitude: 6.891, longitude: 79.858 }
    });
    navigation.navigate('CustomerTracking');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header 
        title="Request Pickup" 
        subtitle="Select items & itemize weight for payout" 
        showBack 
        onBackPress={() => navigation.goBack()} 
        greenTheme
      />

      <View style={styles.content}>
        {/* Section 1: Select Waste Categories */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeaderTitle}>Select Waste Items</Text>
          <Text style={styles.sectionHeaderSub}>Tap item to toggle and configure weight</Text>

          <View style={styles.materialsGrid}>
            {materials.map((mat) => {
              const isSelected = (itemWeights[mat.id] || 0) > 0;
              return (
                <TouchableOpacity
                  key={mat.id}
                  style={[styles.materialCard, isSelected && styles.selectedMaterialCard]}
                  onPress={() => toggleMaterial(mat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 32, marginBottom: 4 }}>{mat.icon}</Text>
                  <Text style={[styles.materialLabel, isSelected && styles.selectedMaterialLabel]}>
                    {mat.label}
                  </Text>
                  <Text style={[styles.rateBadgeTxt, isSelected && styles.selectedRateBadgeTxt]}>
                    LKR {mat.unitPrice}/kg
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Item-wise Weight & Value Configuration */}
        {selectedCategories.length > 0 && (
          <View style={styles.cardContainer}>
            <Text style={styles.sectionHeaderTitle}>Configure Item Weights</Text>
            <Text style={styles.sectionHeaderSub}>Set weight per category to calculate estimated payout & points</Text>

            {selectedCategories.map((catKey) => {
              const mat = materials.find((m) => m.id === catKey);
              if (!mat) return null;
              const weight = itemWeights[catKey] || 0;
              const itemCash = weight * mat.unitPrice;
              const itemPts = Math.round(weight * mat.ptsPerKg);

              return (
                <View key={catKey} style={styles.itemWeightRowCard}>
                  <View style={styles.itemTopInfo}>
                    <View style={styles.itemTitleGroup}>
                      <Text style={{ fontSize: 24, marginRight: 8 }}>{mat.icon}</Text>
                      <View>
                        <Text style={styles.itemTitleTxt}>{mat.label}</Text>
                        <Text style={styles.itemRateSub}>LKR {mat.unitPrice}/kg · {mat.ptsPerKg} pts/kg</Text>
                      </View>
                    </View>

                    {/* Quick Stepper Buttons */}
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity 
                        style={styles.stepBtn} 
                        onPress={() => updateWeight(catKey, -0.5)}
                      >
                        <Text style={styles.stepBtnTxt}>−</Text>
                      </TouchableOpacity>

                      <View style={styles.weightValueBox}>
                        <TextInput
                          style={styles.weightValueInput}
                          value={String(weight)}
                          onChangeText={(val) => setExactWeight(catKey, val)}
                          keyboardType="decimal-pad"
                        />
                        <Text style={styles.kgUnitTxt}>kg</Text>
                      </View>

                      <TouchableOpacity 
                        style={styles.stepBtn} 
                        onPress={() => updateWeight(catKey, 0.5)}
                      >
                        <Text style={styles.stepBtnTxt}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Subtotal Calculation for this item */}
                  <View style={styles.itemSubtotalBar}>
                    <Text style={styles.subtotalTxt}>
                      Subtotal: <Text style={{ fontWeight: '900', color: '#0F172A' }}>LKR {itemCash.toLocaleString()}</Text>
                    </Text>
                    <Text style={styles.ptsRewardTxt}>+{itemPts} EcoPoints</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Section 3: Summary Breakdown Card */}
        {selectedCategories.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Estimated Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Weight:</Text>
              <Text style={styles.summaryVal}>{totalWeight.toFixed(1)} kg</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Cash Payout:</Text>
              <Text style={[styles.summaryVal, { color: '#059669' }]}>LKR {totalCash.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Redeemable Eco Points:</Text>
              <Text style={[styles.summaryVal, { color: '#D97706' }]}>+{totalPoints} pts</Text>
            </View>
          </View>
        )}

        {/* Section 4: Pickup Address */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeaderTitle}>Pickup Address</Text>
          <View style={styles.addressBox}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>📍</Text>
            <Text style={styles.addressTxt}>{address}</Text>
          </View>
        </View>

        {/* Action Button */}
        <Button
          title={selectedCategories.length > 0 ? `Confirm Request (LKR ${totalCash.toLocaleString()})` : "Select Items to Continue"}
          onPress={handleSubmit}
          themeRole="customer"
          disabled={selectedCategories.length === 0}
          style={{ marginTop: 8 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FCEB'
  },
  contentContainer: {
    paddingBottom: 40
  },
  content: {
    padding: 20
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#18181B'
  },
  sectionHeaderSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#256D38',
    marginTop: 2,
    marginBottom: 16
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  materialCard: {
    width: '30.5%',
    height: 104,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  selectedMaterialCard: {
    backgroundColor: '#BEF264', // Lime Accent selected
    borderColor: '#18181B'
  },
  materialLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center'
  },
  selectedMaterialLabel: {
    color: '#047857'
  },
  rateBadgeTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2
  },
  selectedRateBadgeTxt: {
    color: '#059669',
    fontWeight: '800'
  },
  itemWeightRowCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  itemTopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitleTxt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  itemRateSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 4,
    paddingVertical: 2
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBtnTxt: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669'
  },
  weightValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  weightValueInput: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    minWidth: 28,
    textAlign: 'center'
  },
  kgUnitTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 2
  },
  itemSubtotalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  subtotalTxt: {
    fontSize: 12,
    color: '#475569'
  },
  ptsRewardTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706'
  },
  summaryCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0'
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#065F46',
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857'
  },
  summaryVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A'
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 12
  },
  addressTxt: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18
  }
});



