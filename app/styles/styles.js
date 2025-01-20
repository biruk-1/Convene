// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#F4F1FA', // Background color for the header
  },
  headerTitleStyle: {
    fontSize: 24, // Title font size
    fontWeight: 'bold', // Title font weight
    color: '#000', // Title font color (black)
    textAlign: 'center', // Center the text
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

export default styles;
