import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'yellow' | 'danger';
  themeRole?: 'customer' | 'picker';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  themeRole = 'customer',
  loading = false,
  disabled = false,
  style,
  textStyle
}) => {
  const getBackgroundColor = () => {
    if (disabled) return '#E2E8F0';
    if (variant === 'primary') {
      return themeRole === 'picker' ? '#0284C7' : '#22C55E';
    }
    if (variant === 'yellow') return '#F59E0B';
    if (variant === 'secondary') return themeRole === 'picker' ? '#E0F2FE' : '#DCFCE7';
    if (variant === 'danger') return '#EF4444';
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return '#94A3B8';
    if (variant === 'primary' || variant === 'yellow' || variant === 'danger') return '#FFFFFF';
    if (variant === 'secondary') return themeRole === 'picker' ? '#0369A1' : '#15803D';
    return themeRole === 'picker' ? '#0284C7' : '#22C55E';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? (themeRole === 'picker' ? '#0284C7' : '#22C55E') : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    paddingHorizontal: 24,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3
  }
});

