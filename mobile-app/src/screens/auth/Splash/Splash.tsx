import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export const Splash: React.FC<{ navigation: any }> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true
      })
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Brand Icon with Soft Mint Circle */}
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>♻️</Text>
        </View>

        {/* Brand Title */}
        <Text style={styles.appName}>EcoCollect</Text>
        <Text style={styles.tagline}>Smart Recyclable Waste Management</Text>

        {/* Feature Badges */}
        <View style={styles.pillContainer}>
          <View style={styles.greenPill}>
            <Text style={styles.greenPillTxt}>🌿 Doorstep Pickups</Text>
          </View>
          <View style={styles.yellowPill}>
            <Text style={styles.yellowPillTxt}>⭐ Eco Rewards</Text>
          </View>
        </View>
      </Animated.View>

      <Text style={styles.footerTxt}>EcoCollect SAAS v1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFDF5', // Soft Mint Background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#10B981'
  },
  icon: {
    fontSize: 48
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6
  },
  tagline: {
    fontSize: 13,
    color: '#047857',
    marginTop: 6,
    fontWeight: '700',
    textAlign: 'center'
  },
  pillContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24
  },
  greenPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20
  },
  greenPillTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  yellowPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B'
  },
  yellowPillTxt: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '800'
  },
  footerTxt: {
    position: 'absolute',
    bottom: 36,
    color: '#059669',
    fontSize: 12,
    fontWeight: '800'
  }
});

