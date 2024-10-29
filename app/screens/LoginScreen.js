import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import usersData from '../Data/users.json';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext'; // Import useAuth from AuthContext

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth(); // Get login function from auth context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = usersData.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      login(username);  // Set the user in AuthContext
      navigation.navigate('Feed');  // Navigate to the Feed screen
    } else {
      Alert.alert('Invalid credentials', 'Please try again.');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Image source={require('../../assets/images/logo.png')} style={globalStyles.logo} />
      <Text style={globalStyles.title}>Login</Text>

      <TextInput
        style={globalStyles.inputPinkBorder}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={globalStyles.inputPinkBorder}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={globalStyles.fullButtonPink} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;
