import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FeedbackHeader = ({ onPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} // Adjust the path as necessary
          style={styles.profileImage} 
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>Event Organizer</Text>
          <Text style={styles.noticeText}>Notice from the organizer</Text>
        </View>
      </View>

      {/* Feedback Message */}
      <Text style={styles.feedbackText}>
        We would like to hear your feedback about the Annual Developers Conference.
      </Text>

      {/* Feedback Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Feedback')}
        >
          <Text style={styles.buttonText}>Give Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 15,
    backgroundColor: '#ffffff', // Changed to white for a clean look
    alignItems: 'flex-start', // Aligns content to the start
    borderRadius: 10, // Rounded corners for visual appeal
    borderWidth: 1,
    borderColor: '#e0e0e0', // Slightly darker border for contrast
    shadowColor: '#000', // Adds a shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow support
    marginBottom: 20, // Space below the header
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Space between profile and feedback message
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circle image
    marginRight: 10, // Space between image and text
  },
  profileTextContainer: {
    justifyContent: 'flex-start', // Align text to start
  },
  profileName: {
    fontSize: 20, // Increased font size for prominence
    fontWeight: 'bold',
    color: '#333',
  },
  noticeText: {
    fontSize: 12, // Reduced font size for notice text
    color: '#777', // Lighter color for differentiation
  },
  feedbackText: {
    fontSize: 14, // Decreased font size for better hierarchy
    textAlign: 'left', // Align text to the left
    color: '#444',
    marginBottom: 15, // Space between text and button
    paddingHorizontal: 5, // Added padding for text
  },
  buttonContainer: {
    alignItems: 'center', // Center the button horizontally
    width: '100%', // Full width to center the button
  },
  button: {
    backgroundColor: '#fd61e3', // Retained pink color for consistency
    paddingVertical: 10,
    paddingHorizontal: 30, // Adjusted padding for button
    borderRadius: 8, // Rounded corners
    elevation: 2, // Shadow for button
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedbackHeader;
