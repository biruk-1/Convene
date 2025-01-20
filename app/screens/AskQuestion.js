import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

export default function AskQuestion({ route }) {
  const navigation = useNavigation();
  const { userName, userId } = route.params; // Assuming userId is passed to route params

  const [selectedOption, setSelectedOption] = useState(null);
  const [question, setQuestion] = useState('');

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Function to handle API request
  const submitQuestion = async () => {
    if (!question || !selectedOption) {
      Alert.alert("Error", "Please enter a question and select an option.");
      return;
    }

    // Determine askType based on selectedOption
    const askType = selectedOption === 'anonymous' ? '0' : userId; // '0' for anonymous, userId for named

    const payload = {
      question: question,
      askType: askType, // This will be '0' or userId depending on selection
      event: '1', // Assuming '1' as shown in Postman example
    };

    try {
      const response = await fetch('https://zelesegna.com/convene/app/ask_question.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(payload).toString(), // Convert payload to URL-encoded string
      });

      const data = await response.json();
      if (data.status === 'success') {
        Alert.alert("Success", "Your question has been submitted!");
        setQuestion(''); // Reset question field
        setSelectedOption(null); // Reset selection
        navigation.goBack(); // Go back to the previous screen
      } else {
        Alert.alert("Error", data.result || "An error occurred.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Could not submit your question. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <TextInput
        placeholder="State your question here..."
        placeholderTextColor="#b0b0b0"
        style={[styles.input, { backgroundColor: currentTheme.secondary, color: currentTheme.text }]}
        multiline
        value={question}
        onChangeText={setQuestion}
      />

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
            Ask as <Text style={{ fontWeight: 'bold' }}>{userName}</Text>
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

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: currentTheme.primary }]}
        onPress={submitQuestion}
      >
        <Text style={[styles.submitButtonText, { color: currentTheme.background }]}>Submit Question</Text>
      </TouchableOpacity>

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
  submitButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
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
