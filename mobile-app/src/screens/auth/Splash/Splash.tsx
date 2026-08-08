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
        {/* Brand Icon with Soft Lime Circle */}
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>♻️</Text>
        </View>

        {/* Brand Title */}
        <Text style={styles.appName}>EcoCollect</Text>
        <Text style={styles.tagline}>Building the Future, Naturally 🌿</Text>

        {/* Pitch Deck Feature Pill Badges */}
        <View style={styles.pillContainer}>
          <View style={styles.greenPill}>
            <Text style={styles.greenPillTxt}>🌿 Doorstep Pickups</Text>
          </View>
          <View style={styles.yellowPill}>
            <Text style={styles.yellowPillTxt}>⭐ Eco Rewards</Text>
          </View>
        </View>
      </Animated.View>

      <Text style={styles.footerTxt}>EcoCollect Enterprise v1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FCEB', // Soft Organic Bamboo Eco Cream
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#BEF264',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#18181B'
  },
  icon: {
    fontSize: 48
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -0.6
  },
  tagline: {
    fontSize: 13,
    color: '#256D38',
    marginTop: 6,
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  pillContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24
  },
  greenPill: {
    backgroundColor: '#256D38',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  greenPillTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  yellowPill: {
    backgroundColor: '#BEF264',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#18181B'
  },
  yellowPillTxt: {
    color: '#18181B',
    fontSize: 12,
    fontWeight: '800'
  },
  footerTxt: {
    position: 'absolute',
    bottom: 36,
    color: '#256D38',
    fontSize: 12,
    fontWeight: '800'
  }
});
