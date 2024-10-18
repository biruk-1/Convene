import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  cameraIcon: {
    fontSize: 30,
    color: '#007AFF',
    marginBottom: 10,
  },
  galleryContainer: {
    flex: 1,
    marginTop: 10,
  },
  galleryItem: {
    width: 100,
    height: 100,
    margin: 5,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Same background as SplashScreen
  },
  logo: {
    width: 150, // Adjust as needed
    height: 150, // Adjust as needed
    marginBottom: 30, // Adds space below the logo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fd61e3', // Pink color for the title
    marginBottom: 20,
  },
  inputPinkBorder: {
    width: '80%', // Full-width input
    borderColor: '#fd61e3', // Pink border
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff', // White background for input
  },
  fullButtonPink: {
    width: '80%',
    padding: 15,
    backgroundColor: '#fd61e3', // Pink background for button
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text for button
    fontSize: 16,
    fontWeight: 'bold',
  },
});
