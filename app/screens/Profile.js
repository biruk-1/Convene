import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../Components/Footer';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

const Profile = () => {
  const userName = "John Doe"; // Replace with dynamic user data
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.profileSection, { backgroundColor: currentTheme.secondary }]}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} // Replace with dynamic user image
              style={styles.profileImage} 
            />
            <TouchableOpacity style={[styles.editIcon, { backgroundColor: currentTheme.primary }]}>
              <MaterialIcons name="edit" size={20} color={currentTheme.text} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: currentTheme.text }]}>{userName}</Text>
        </View>

        <View style={[styles.menuContainer, { backgroundColor: currentTheme.secondary }]}>
          <MenuItem icon="lock" title="Change Password" theme={currentTheme} />
          <MenuItem icon="notifications" title="Notification Settings" theme={currentTheme} />
          <MenuItem icon="report-problem" title="Report Problem" theme={currentTheme} />
          <MenuItem icon="logout" title="Logout" theme={currentTheme} />
        </View>
      </ScrollView>
      
      <Footer style={styles.footer} />
    </View>
  );
};

const MenuItem = ({ icon, title, theme }) => {
  return (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.primary }]}>
      <MaterialIcons name={icon} size={24} color={theme.primary} />
      <Text style={[styles.menuTitle, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // Add padding to avoid overlap with footer
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 15,
    padding: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
  },
  menuContainer: {
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuTitle: {
    marginLeft: 15,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Profile;