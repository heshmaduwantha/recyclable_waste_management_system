import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
  greenTheme?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBackPress,
  rightElement,
  style,
  greenTheme = false
}) => {
  return (
    <View style={[styles.container, greenTheme && styles.greenContainer, style]}>
      <View style={styles.leftGroup}>
        {showBack && (
          <TouchableOpacity 
            onPress={onBackPress} 
            style={[styles.backBtn, greenTheme && styles.greenBackBtn]} 
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={greenTheme ? '#059669' : '#0F172A'} />
          </TouchableOpacity>
        )}
        <View style={styles.textGroup}>
          <Text style={[styles.title, greenTheme && styles.greenTitle]}>{title}</Text>
          {subtitle && (
            <View style={styles.subRow}>
              {greenTheme && <View style={styles.greenDot} />}
              <Text style={[styles.subtitle, greenTheme && styles.greenSubtitle]}>{subtitle}</Text>
            </View>
          )}
        </View>
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },

  greenContainer: {
    backgroundColor: '#ECFDF5',
    borderBottomColor: '#A7F3D0'
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  textGroup: {
    flex: 1
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  greenBackBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#A7F3D0'
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  greenTitle: {
    color: '#065F46'
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981'
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600'
  },
  greenSubtitle: {
    color: '#047857'
  }
});


