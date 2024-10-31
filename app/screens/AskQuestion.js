import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

export default function AskQuestion({ route }) {
  const navigation = useNavigation();
  const { userName } = route.params;

  // State for tracking selected ask option
  const [selectedOption, setSelectedOption] = useState(null);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Input box for question */}
      <TextInput
        placeholder="State your question here..."
        placeholderTextColor="#b0b0b0"
        style={[styles.input, { backgroundColor: currentTheme.secondary, color: currentTheme.text }]}
        multiline
      />

      {/* Ask options */}
      <View style={styles.askOptionsContainer}>
        <TouchableOpacity
          style={[
            styles.askOptionBox,
            { borderColor: currentTheme.primary },
            selectedOption === 'user' && { backgroundColor: currentTheme.primary },
          ]}
          onPress={() => setSelectedOption('user')}
        >
          <Icon
            name="person-circle-outline"
            size={30}
            color={selectedOption === 'user' ? currentTheme.text : currentTheme.primary}
          />
          <Text
            style={[
              styles.askOptionText,
              { color: currentTheme.text },
              selectedOption === 'user' && { color: currentTheme.text, fontWeight: 'bold' },
            ]}
          >
            Ask as {userName}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.askOptionBox,
            { borderColor: currentTheme.primary },
            selectedOption === 'anonymous' && { backgroundColor: currentTheme.primary },
          ]}
          onPress={() => setSelectedOption('anonymous')}
        >
          <Icon
            name="person-outline"
            size={30}
            color={selectedOption === 'anonymous' ? currentTheme.text : currentTheme.primary}
          />
          <Text
            style={[
              styles.askOptionText,
              { color: currentTheme.text },
              selectedOption === 'anonymous' && { color: currentTheme.text, fontWeight: 'bold' },
            ]}
          >
            Ask Anonymously
          </Text>
        </TouchableOpacity>
      </View>

      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.cancelButton, { backgroundColor: currentTheme.secondary, borderColor: currentTheme.primary }]}>
        <Text style={[styles.cancelButtonText, { color: currentTheme.primary }]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: '50%',
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  askOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  askOptionBox: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  askOptionText: {
    marginTop: 10,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});