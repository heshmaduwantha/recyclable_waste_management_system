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
      return themeRole === 'picker' ? '#0284C7' : '#10B981';
    }
    if (variant === 'yellow') return '#BEF264';
    if (variant === 'secondary') return themeRole === 'picker' ? '#E0F2FE' : '#ECFDF5';
    if (variant === 'danger') return '#EF4444';
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return '#94A3B8';
    if (variant === 'yellow') return '#18181B';
    if (variant === 'primary' || variant === 'danger') return '#FFFFFF';
    if (variant === 'secondary') return themeRole === 'picker' ? '#0369A1' : '#059669';
    return themeRole === 'picker' ? '#0284C7' : '#10B981';
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
          borderColor: '#18181B',
          borderWidth: 1.5
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
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  text: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2
  }
});
