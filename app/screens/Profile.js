import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons for the icons
import Footer from '../Components/Footer';
// import styles from '../styles/styles';

const Profile = () => {
  const userName = "John Doe"; // Replace with dynamic user data

  return (
    <View>
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with dynamic user image
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <MenuItem icon="lock" title="Change Password" />
        <MenuItem icon="notifications" title="Notification Settings" />
        <MenuItem icon="report-problem" title="Report Problem" />
        <MenuItem icon="logout" title="Logout" />
      </View>
      
    </View>
    <Footer style={styles.footer} />
    </View>
  );
};

// MenuItem Component for displaying menu options
const MenuItem = ({ icon, title }) => {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <MaterialIcons name={icon} size={24} color="#5E5E5E" />
      <Text style={styles.menuTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom:'30%',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6347', // Tomato color for the edit icon background
    borderRadius: 50,
    padding: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: '#5E5E5E',
  },
  
});

export default Profile;
