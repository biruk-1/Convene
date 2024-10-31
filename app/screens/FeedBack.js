import React, { useState, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

const questions = [
  "How do you rate the annual developers conference?",
  "How satisfied are you with the speakers?",
  "How would you rate the networking opportunities?",
  "Was the venue suitable for the event?",
  "Would you attend again next year?",
];

const options = ["Very Exciting", "Amazing", "Not Bad", "Satisfactory", "Unsatisfactory"];

const Feedback = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null); // Reset selection for the next question
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Feedback submitted');
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ScrollView>
        <Text style={[styles.question, { color: currentTheme.text }]}>{questions[currentQuestion]}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                { borderColor: currentTheme.primary },
                selectedOption === index && { backgroundColor: currentTheme.primary },
              ]}
              onPress={() => setSelectedOption(index)}
            >
              <Text style={[styles.optionText, { color: currentTheme.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.pagination}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: currentTheme.secondary },
                currentQuestion === index && { backgroundColor: currentTheme.primary },
              ]}
            />
          ))}
        </View>
        {currentQuestion < questions.length - 1 ? (
          <Button
            title="Continue"
            onPress={handleNext}
            disabled={selectedOption === null}
            color={currentTheme.primary} // Use theme color for button
          />
        ) : (
          <Button
            title="Submit Feedback"
            onPress={handleSubmit}
            color={currentTheme.primary} // Use theme color for button
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default Feedback;