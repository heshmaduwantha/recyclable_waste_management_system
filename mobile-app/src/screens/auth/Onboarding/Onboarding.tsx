import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const Onboarding: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      step: '1/3',
      title: 'Recycle from Home',
      subtitle: 'Schedule waste pickups from your doorstep. Our AI identifies recyclable materials and helps you do your part effortlessly.',
      graphic: (
        <View style={styles.illustrationBox}>
          <View style={styles.homeBox}>
            <Text style={{ fontSize: 64 }}>🏠</Text>
            <View style={styles.recyclerBadge}>
              <Text style={{ fontSize: 24 }}>♻️</Text>
            </View>
          </View>
        </View>
      )
    },
    {
      step: '2/3',
      title: 'Schedule a Pickup',
      subtitle: 'Choose your preferred time and our certified collectors arrive at your door. Track them live on the map.',
      graphic: (
        <View style={styles.illustrationBox}>
          <View style={styles.truckBox}>
            <Text style={{ fontSize: 68 }}>🚚</Text>
            <View style={styles.sunBadge}>
              <Text style={{ fontSize: 22 }}>☀️</Text>
            </View>
          </View>
        </View>
      )
    },
    {
      step: '3/3',
      title: 'Earn Eco Points',
      subtitle: 'Turn recyclables into rewards! Redeem Eco Points for mobile recharges, vouchers, and exclusive perks.',
      graphic: (
        <View style={styles.illustrationBox}>
          <View style={styles.cardGraphicBox}>
            <View style={styles.rewardCard}>
              <Text style={{ fontSize: 32 }}>💳</Text>
              <View style={styles.pointsTag}>
                <Text style={styles.pointsTagTxt}>2,450 pts ⭐</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const activeSlide = slides[currentSlide];

  return (
    <View style={styles.container}>
      {/* Top Bar Header */}
      <View style={styles.topHeader}>
        <Text style={styles.stepTxt}>{activeSlide.step}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
          <Text style={styles.skipTxt}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Center Soft Mint Graphic Card */}
      <View style={styles.graphicContainer}>
        {activeSlide.graphic}
      </View>

      {/* Page Indicator Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              currentSlide === idx && styles.activeDot
            ]}
          />
        ))}
      </View>

      {/* Typography Section */}
      <View style={styles.textSection}>
        <Text style={styles.title}>{activeSlide.title}</Text>
        <Text style={styles.subtitle}>{activeSlide.subtitle}</Text>
      </View>

      {/* Bottom Action Button (Soft Emerald Green) */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={handleNext}
        activeOpacity={0.85}
      >
        <Text style={styles.actionBtnTxt}>
          {currentSlide === slides.length - 1 ? 'Get Started →' : 'Continue →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 36,
    justifyContent: 'space-between'
  },

  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  stepTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8'
  },
  skipTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B'
  },
  graphicContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#E8F8F0', // Soft Pastel Mint Background
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5'
  },
  illustrationBox: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeBox: {
    alignItems: 'center',
    position: 'relative'
  },
  recyclerBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6
  },
  truckBox: {
    alignItems: 'center',
    position: 'relative'
  },
  sunBadge: {
    position: 'absolute',
    top: -20,
    right: -20
  },
  cardGraphicBox: {
    alignItems: 'center'
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3
  },
  pointsTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F59E0B'
  },
  pointsTagTxt: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D97706'
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0'
  },
  activeDot: {
    width: 26,
    backgroundColor: '#10B981', // Soft Emerald Green Active Dot
    borderRadius: 4
  },
  textSection: {
    alignItems: 'flex-start',
    marginBottom: 10
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 22
  },
  actionBtn: {
    backgroundColor: '#10B981', // Soft Emerald Green Action Button
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  actionBtnTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF'
  }
});


