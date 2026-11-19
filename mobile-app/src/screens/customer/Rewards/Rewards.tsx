import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { Ionicons } from '@expo/vector-icons';
import { useApiData } from '../../../hooks/useApiData';
import { rewardService, CatalogueReward } from '../../../services/reward.service';
import { customerService } from '../../../services/customer.service';
import { useAuth } from '../../../store/auth/AuthContext';

export const CustomerRewards: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedReload, setSelectedReload] = useState<CatalogueReward | null>(null);
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [showModal, setShowModal] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const { data, error, reload } = useApiData(() => Promise.all([rewardService.getRewards(), customerService.wallet()]), [user?.id]);
  const [recharges, wallet] = data || [[], null];
  const balance = wallet?.totalPoints ?? 0;

  const handleRedeemClick = (item: CatalogueReward) => {
    setSelectedReload(item);
    setModalError(null);
    setShowModal(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReload) return;
    if (!/^\+?[0-9 ]{9,15}$/.test(mobileNumber.trim())) {
      setModalError('Enter a valid mobile number.');
      return;
    }
    setRedeeming(true);
    setModalError(null);
    try {
      const res = await rewardService.redeem(selectedReload.id, mobileNumber.trim());
      setShowModal(false);
      reload();
      navigation.navigate('RewardSuccess', {
        redemptionId: res.redemptionId,
        rewardTitle: res.reward.title,
        mobileNumber: mobileNumber.trim(),
        newBalance: res.newBalance
      });
    } catch (e) {
      setModalError((e as Error).message);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} bounces={false}>
      <Header title="Mobile Reload Rewards 📱" subtitle="Redeem EcoPoints as instant Dialog & Mobitel mobile recharges" greenTheme />

      <View style={styles.body}>
        {/* Total EcoPoints Summary Card */}
        <Card style={styles.pointsSummaryCard}>
          <Text style={styles.summaryLabel}>Total EcoPoints Balance</Text>
          <Text style={styles.summaryValue}>{balance.toLocaleString()} pts</Text>
          <Text style={styles.summarySub}>Convert your recyclable waste into instant mobile recharges!</Text>
        </Card>

        {/* Available Mobile Recharges Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Dialog & Mobitel Recharges</Text>
          </View>
        </View>

        {error && <Text style={{ color: '#DC2626', marginBottom: 12 }}>⚠️ {error}</Text>}
        {recharges.map((item) => (
          <Card key={item.id} style={styles.rewardItemCard}>
            <View style={[styles.rewardIconBg, { backgroundColor: item.color === '#DC2626' ? '#FEF2F2' : '#F0F9FF' }]}>
              <Text style={{ fontSize: 26 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.providerBadge}>
                <Text style={[styles.providerTxt, { color: item.color }]}>{item.partnerName}</Text>
              </View>

              <Text style={styles.rewardTitle}>{item.title}</Text>
              <Text style={styles.rewardDesc}>{item.description}</Text>

              <View style={styles.rewardFooter}>
                <Text style={styles.rewardPts}>⭐ {item.pointsRequired} pts</Text>
                <TouchableOpacity
                  style={[styles.redeemPill, balance < item.pointsRequired && { opacity: 0.4 }]}
                  disabled={balance < item.pointsRequired}
                  onPress={() => handleRedeemClick(item)}
                >
                  <Text style={styles.redeemPillTxt}>{balance < item.pointsRequired ? 'Not enough pts' : 'Redeem Now'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Mobile Number Prompt Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Mobile Reload 📱</Text>
            <Text style={styles.modalSub}>{selectedReload?.title}</Text>

            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>ENTER DIALOG OR MOBITEL NUMBER</Text>
              <TextInput
                style={styles.mobileInput}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                placeholder="077 123 4567"
              />
            </View>

            {modalError && <Text style={{ color: '#DC2626', fontWeight: '600', marginBottom: 8 }}>⚠️ {modalError}</Text>}
            <View style={styles.modalBtns}>
              <Button title={`Confirm · ${selectedReload?.pointsRequired ?? 0} pts ✨`} onPress={handleConfirmRedeem} loading={redeeming} disabled={redeeming} style={{ width: '100%' }} />
              <Button title="Cancel" onPress={() => setShowModal(false)} variant="outline" style={{ width: '100%', marginTop: 8 }} />
            </View>
          </View>
        </View>
      </Modal>
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
  pointsSummaryCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1.5,
    marginBottom: 16
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857'
  },
  summaryValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#065F46',
    marginVertical: 4
  },
  summarySub: {
    fontSize: 12,
    color: '#047857'
  },
  tierContainer: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#A7F3D0'
  },
  tierLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  tierCurrent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857'
  },
  tierNext: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706'
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1FAE5',
    overflow: 'hidden',
    marginBottom: 6
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4
  },
  tierSub: {
    fontSize: 11,
    color: '#047857',
    textAlign: 'right'
  },
  goldBannerCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    marginBottom: 20
  },
  goldBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D97706'
  },
  goldBannerSub: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 14
  },
  goldBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center'
  },
  goldBtnTxt: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A'
  },
  rewardItemCard: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
    alignItems: 'center'
  },
  rewardIconBg: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  providerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  providerTxt: {
    fontSize: 10,
    fontWeight: '900'
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  rewardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  rewardPts: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D97706'
  },
  redeemPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16
  },
  redeemPillTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A'
  },
  modalSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 2,
    marginBottom: 16
  },
  inputBox: {
    width: '100%',
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 6
  },
  mobileInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1
  },
  modalBtns: {
    width: '100%'
  }
});


