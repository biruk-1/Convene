import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState('User');
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const { logout } = useAuth();

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          // Set user name from stored data
          if (parsedData.first_name && parsedData.last_name) {
            setUserName(`${parsedData.first_name} ${parsedData.last_name}`);
          } else if (parsedData.first_name) {
            setUserName(parsedData.first_name);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Confirm logout and perform the action
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout(); // Clear session and navigate to login screen
            navigation.replace('Login'); // Navigate to Login screen
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={currentTheme.background} 
      />
      
      {/* Header Section - Matching other screens */}
      <View style={[styles.header, { backgroundColor: currentTheme.background }]}>
        <View style={styles.headerTopRow}>
          <Text style={[styles.appName, { color: currentTheme.text }]}>Convene</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Icon name="notifications-outline" size={22} color={currentTheme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Icon name="settings-outline" size={22} color={currentTheme.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={[styles.profileTitle, { color: currentTheme.text }]}>Profile</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={[styles.profileHeader, { backgroundColor: currentTheme.background }]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ 
                uri: userData?.pro_pic || 'https://via.placeholder.com/150/4A148C/FFFFFF?text=' + userName.charAt(0).toUpperCase()
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton} activeOpacity={0.8}>
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfoContainer}>
            <Text style={[styles.userName, { color: currentTheme.text }]}>{userName}</Text>
            <Text style={[styles.userEmail, { color: currentTheme.text }]}>
              {userData?.email || 'user@example.com'}
            </Text>
            <Text style={[styles.userPosition, { color: currentTheme.text }]}>
              {userData?.position || 'Event Participant'}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsContainer, { backgroundColor: currentTheme.background }]}>
          <View style={[styles.statItem, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa' }]}>
            <Text style={[styles.statNumber, { color: currentTheme.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: currentTheme.text }]}>Events</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa' }]}>
            <Text style={[styles.statNumber, { color: currentTheme.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: currentTheme.text }]}>Questions</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa' }]}>
            <Text style={[styles.statNumber, { color: currentTheme.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: currentTheme.text }]}>Posts</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: currentTheme.background }]}>
          <MenuItem 
            icon="person-outline" 
            title="Edit Profile" 
            subtitle="Update your personal information"
            theme={currentTheme} 
          />
          <MenuItem 
            icon="lock-closed-outline" 
            title="Change Password" 
            subtitle="Update your account security"
            theme={currentTheme} 
          />
          <MenuItem 
            icon="notifications-outline" 
            title="Notification Settings" 
            subtitle="Manage your notifications"
            theme={currentTheme} 
          />
          <MenuItem 
            icon="help-circle-outline" 
            title="Help & Support" 
            subtitle="Get help and contact support"
            theme={currentTheme} 
          />
          <MenuItem 
            icon="information-circle-outline" 
            title="About" 
            subtitle="App version and information"
            theme={currentTheme} 
          />
        </View>

        {/* Logout Section */}
        <View style={[styles.logoutSection, { backgroundColor: currentTheme.background }]}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa' }]} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, title, subtitle, theme, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.menuItem, { borderBottomColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)' }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? 'rgba(74, 20, 140, 0.2)' : 'rgba(74, 20, 140, 0.1)' }]}>
          <Icon name={icon} size={20} color="#4A148C" />
        </View>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.menuSubtitle, { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>{subtitle}</Text>}
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color={theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: Platform.OS === 'ios' ? 4 : 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 6,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#4A148C',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A148C',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  userPosition: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  logoutSection: {
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Profile;
