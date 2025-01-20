import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView ,Text} from 'react-native';
import Feed from '../Components/Feed';
import Footer from '../Components/Footer';
import FeedbackHeader from './FeedbackHeader';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

const FeedScreen = () => {
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={[styles.header, { backgroundColor: currentTheme.secondary }]}>
             <Text style={[styles.headerText, { color: currentTheme.text }]}>Feed</Text>
        </View>
        <FeedbackHeader />
        <Feed />
      </ScrollView>
      {/* Fixed Footer */}
      <Footer style={[styles.footer, { backgroundColor: currentTheme.secondary }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Add padding so content doesn't overlap with footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Adjust height of the footer as necessary
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensures the footer is above other content
  },
  header: {
    paddingTop:'2%',
    paddingBottom:'2%',
    paddingLeft:'5%',
    paddingVertical: 3,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default FeedScreen;