import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Button } from '../../../common/Button/Button';

export const Feedback: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Feedback & Review" subtitle="Share your thoughts & app experience" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.title}>Rate Your Experience</Text>
          <Text style={styles.sub}>How satisfied are you with EcoCollect?</Text>

          {/* Star Rating Controls */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                <Text style={{ fontSize: 36, opacity: star <= rating ? 1 : 0.25 }}>⭐</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Tell us what you liked or how we can improve..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
          />

          <Button title="Submit Feedback" onPress={() => navigation.goBack()} style={{ width: '100%', marginTop: 16 }} />
        </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  sub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  textInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
    height: 110
  }
});
