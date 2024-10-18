import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { globalStyles } from '../styles/globalStyles';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={globalStyles.footer}>
      <TouchableOpacity  onPress={() => navigation.navigate('Feed')}>
        <Icon name="home-outline" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CalanderView')}>
        <Icon name="calendar-outline" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AddPostScreen')}> {/* Add navigation */}
        <Icon name="add-circle-outline" size={40} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('QuestionsPage')}>
        <Icon name="help-circle-outline" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Icon name="person-outline" size={30} />
      </TouchableOpacity>
    </View>
  );
}
