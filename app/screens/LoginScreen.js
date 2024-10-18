import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import usersData from '../Data/users.json';
import PropTypes from 'prop-types'; // Import PropTypes for validation

const LoginScreen = ({ navigation }) => {
  // State variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login
  const handleLogin = () => {
    // Find the user with matching credentials
    const user = usersData.find(
      (user) => user.username === username && user.password === password
    );
    
    // Navigate to Feed screen if user is found, otherwise show alert
    if (user) {
      navigation.navigate('Feed'); // This navigates to the Feed screen
    } else {
      Alert.alert('Invalid credentials', 'Please try again.');
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Logo at the top */}
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={globalStyles.logo} 
      />
      
      <Text style={globalStyles.title}>Login</Text>

      {/* Username Input */}
      <TextInput
        style={globalStyles.inputPinkBorder} // New style with pink border
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" // Prevent auto-capitalization
      />

      {/* Password Input */}
      <TextInput
        style={globalStyles.inputPinkBorder} // New style with pink border
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Full-width Pink Login Button */}
      <TouchableOpacity style={globalStyles.fullButtonPink} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// PropTypes validation
LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;
