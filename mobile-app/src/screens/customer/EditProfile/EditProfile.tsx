import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../../common/Header/Header';
import { Input } from '../../../common/Input/Input';
import { Button } from '../../../common/Button/Button';
import { useAuth } from '../../../store/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const CustomerEditProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [email, setEmail] = useState(user?.email || 'priya@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+94 77 123 4567');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <Header title="Edit Profile" subtitle="Update account details & photo" showBack onBackPress={() => navigation.goBack()} greenTheme />

      <View style={styles.body}>
        {/* Avatar Edit Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarTxt}>PS</Text>
            <TouchableOpacity style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoTxt}>Change Profile Picture</Text>
        </View>

        {/* Inputs */}
        <Input label="Full Name" value={name} onChangeText={setName} />
        <Input label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Button title="Save Changes" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24
  },
  avatarWrapper: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FEF3C7',
    borderWidth: 3,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  avatarTxt: {
    fontSize: 28,
    fontWeight: '900',
    color: '#D97706'
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  changePhotoTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 10
  }
});
