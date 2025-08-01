import React, { useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  StatusBar, 
  SafeAreaView, 
  Platform,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Feed from '../Components/Feed';
import Footer from '../Components/Footer';
import FeedbackHeader from './FeedbackHeader';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FeedScreen = () => {
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={currentTheme.background} 
      />
      
      {/* Header Section - Matching Screenshot */}
      <View style={[styles.header, { backgroundColor: currentTheme.background }]}>
        {/* Top Row with App Name and Icons */}
        <View style={styles.headerTopRow}>
          <Text style={[styles.appName, { color: currentTheme.text }]}>Convene</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={22} color={currentTheme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                              <Ionicons name="download-outline" size={22} color={currentTheme.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Feed Title */}
        <Text style={[styles.feedTitle, { color: currentTheme.text }]}>Feed</Text>
      </View>
      
      {/* Scrollable Content Area */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <FeedbackHeader />
        <Feed />
      </ScrollView>
      
      {/* Modern Footer */}
      <Footer />
    </SafeAreaView>
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
  feedTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0, // Remove extra padding to fix footer spacing
  },
});

export default FeedScreen;