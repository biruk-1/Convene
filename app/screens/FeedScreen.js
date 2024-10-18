import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Feed from '../Components/Feed';
import Footer from '../Components/Footer';
import FeedbackHeader from './FeedbackHeader';

const FeedScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FeedbackHeader />
        <Feed />
      </ScrollView>
      {/* Fixed Footer */}
      <Footer style={styles.footer} />
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
    backgroundColor: '#f8f8f8', // Your footer background color
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensures the footer is above other content
  },
});

export default FeedScreen;
