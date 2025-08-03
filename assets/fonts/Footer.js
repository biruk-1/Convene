import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { globalStyles } from '../styles/globalStyles';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={globalStyles.footer}>
      <TouchableOpacity>
        <Ionicons name="home-outline" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CalanderView')}>
        <Ionicons name="calendar-outline" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AddPostScreen')}> {/* Add navigation */}
        <Ionicons name="add-circle-outline" size={40} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('QuestionsPage')}>
        <Ionicons name="help-circle-outline" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={30} />
      </TouchableOpacity>
    </View>
  );
}
