import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { EmptyState } from '../../../common/EmptyState/EmptyState';

export const EmptyStateScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header title="Empty State Demo" subtitle="Reusable empty data placeholder" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        <EmptyState
          title="No Pickup Records Found"
          message="You haven't requested any recycling collections yet. Start recycling today to earn rewards!"
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  body: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  }
});
