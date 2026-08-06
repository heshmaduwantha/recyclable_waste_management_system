import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../../common/Header/Header';

export const SkeletonLoading: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Loading Shimmer" subtitle="Skeleton loader placeholder" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        <View style={styles.heroSkeleton} />

        <View style={styles.cardSkeleton} />
        <View style={styles.cardSkeleton} />
        <View style={styles.cardSkeleton} />
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
  heroSkeleton: {
    height: 140,
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    marginBottom: 20
  },
  cardSkeleton: {
    height: 84,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    marginBottom: 12
  }
});
