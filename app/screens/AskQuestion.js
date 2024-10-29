import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';

export default function AskQuestion({ route }) {
  const navigation = useNavigation();
  const { userName } = route.params;

  // State for tracking selected ask option
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={styles.container}>
      {/* Input box for question */}
      <TextInput
        placeholder="State your question here..."
        style={styles.input}
        multiline
      />

      {/* Ask options */}
      <View style={styles.askOptionsContainer}>
        <TouchableOpacity
          style={[
            styles.askOptionBox,
            selectedOption === 'user' && styles.selectedOptionBox
          ]}
          onPress={() => setSelectedOption('user')}
        >
          <Icon
            name="person-circle-outline"
            size={30}
            color={selectedOption === 'user' ? '#cc0077' : '#000'}
          />
          <Text
            style={[
              styles.askOptionText,
              selectedOption === 'user' && styles.selectedOptionText
            ]}
          >
            Ask as {userName}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.askOptionBox,
            selectedOption === 'anonymous' && styles.selectedOptionBox
          ]}
          onPress={() => setSelectedOption('anonymous')}
        >
          <Icon
            name="person-outline"
            size={30}
            color={selectedOption === 'anonymous' ? '#cc0077' : '#000'}
          />
          <Text
            style={[
              styles.askOptionText,
              selectedOption === 'anonymous' && styles.selectedOptionText
            ]}
          >
            Ask Anonymously
          </Text>
        </TouchableOpacity>
      </View>

      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fa',
  },
  input: {
    height: '50%',
    backgroundColor: '#eaeaea',
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  askOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  askOptionBox: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
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
    color: '#333',
    fontSize: 16,
  },
  selectedOptionBox: {
    borderColor: '#cc0077',
    backgroundColor: '#fce4f7',
  },
  selectedOptionText: {
    color: '#cc0077',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#f8f0fa',
    borderWidth: 1,
    borderColor: '#cc0077',
  },
  cancelButtonText: {
    color: '#cc0077',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
