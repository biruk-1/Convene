import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling function
const scale = (size) => (width / 375) * size; // 375 is the base width (iPhone 6/7/8)

export const globalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  logo: {
    width: scale(150), // Responsive logo size
    height: scale(150), // Maintain aspect ratio
    marginBottom: scale(30),
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: scale(20),
  },
  input: {
    width: '90%',
    height: scale(50),
    paddingHorizontal: scale(15),
    marginBottom: scale(20),
    borderWidth: 1,
    borderRadius: scale(10),
    fontSize: scale(16),
  },
  loginButton: {
    width: '90%',
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(10),
    marginBottom: scale(10),
  },
  buttonText: {
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    marginTop: scale(10),
    fontSize: scale(14),
    textDecorationLine: 'underline',
  },
});