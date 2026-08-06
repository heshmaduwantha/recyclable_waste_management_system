import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'info' | 'primary';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary' }) => {
  const getColors = () => {
    switch (variant) {
      case 'success': return { bg: '#DCFCE7', text: '#16A34A' };
      case 'warning': return { bg: '#FEF3C7', text: '#D97706' };
      case 'info': return { bg: '#E0F2FE', text: '#0284C7' };
      default: return { bg: '#E2E8F0', text: '#334155' };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize'
  }
});
