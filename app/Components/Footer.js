import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';

export default function Footer() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Feed');

  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  // Update the activeTab when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setActiveTab(routeName);
    }, [navigation])
  );

  return (
    <View style={[globalStyles.footer, styles.footerContainer]}>
      <TouchableOpacity onPress={() => handlePress('Feed')} style={styles.iconWrapper}>
        <View style={[styles.circle, activeTab === 'Feed' && styles.activeCircle]}>
          <Icon name="home-outline" size={25} color={activeTab === 'Feed' ? '#fff' : '#000'} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('CalanderView')} style={styles.iconWrapper}>
        <View style={[styles.circle, activeTab === 'CalanderView' && styles.activeCircle]}>
          <Icon name="calendar-outline" size={25} color={activeTab === 'CalanderView' ? '#fff' : '#000'} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('AddPostScreen')} style={styles.iconWrapper}>
        <View style={[styles.circle, activeTab === 'AddPostScreen' && styles.activeCircle]}>
          <Icon name="add-circle-outline" size={35} color={activeTab === 'AddPostScreen' ? '#fff' : '#000'} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('QuestionsPage')} style={styles.iconWrapper}>
        <View style={[styles.circle, activeTab === 'QuestionsPage' && styles.activeCircle]}>
          <Icon name="help-circle-outline" size={25} color={activeTab === 'QuestionsPage' ? '#fff' : '#000'} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('Profile')} style={styles.iconWrapper}>
        <View style={[styles.circle, activeTab === 'Profile' && styles.activeCircle]}>
          <Icon name="person-outline" size={25} color={activeTab === 'Profile' ? '#fff' : '#000'} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    padding: 8,
  },
  activeCircle: {
    backgroundColor: '#cc0077',
  },
});
