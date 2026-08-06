import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Card } from '../../../common/Card/Card';
import { Ionicons } from '@expo/vector-icons';

export const HelpSupport: React.FC<{ navigation: any }> = ({ navigation }) => {
  const faqs = [
    { q: 'How do I request a waste pickup?', a: 'Tap "Schedule Pickup" on the home dashboard, select your waste categories & weights, pick a time slot, and confirm.' },
    { q: 'How are Eco Points calculated?', a: 'Eco Points are awarded based on verified weighed recyclables (e.g. 1 kg plastic = 50 points, 1 kg paper = 30 points).' },
    { q: 'When will the collector arrive?', a: 'Collectors arrive within your selected 2-hour window. You can track them live on the map.' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Help & Support" subtitle="FAQs & 24/7 customer helpline" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        {/* Support Contact Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <Ionicons name="logo-whatsapp" size={28} color="#10B981" />
            <Text style={[styles.contactTitle, { color: '#047857' }]}>WhatsApp Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactCard, { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' }]}>
            <Ionicons name="call" size={28} color="#0284C7" />
            <Text style={[styles.contactTitle, { color: '#0369A1' }]}>Helpline 1999</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <View style={[styles.titleAccentBar, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          </View>
        </View>

        {faqs.map((faq, idx) => (
          <Card key={idx} style={styles.faqCard}>
            <Text style={styles.questionTxt}>{faq.q}</Text>
            <Text style={styles.answerTxt}>{faq.a}</Text>
          </Card>
        ))}
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  contactCard: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  titleAccentBar: {
    width: 4,
    height: 18,
    borderRadius: 2
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  questionTxt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6
  },
  answerTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 19
  }
});
