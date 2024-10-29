// Feedback.js
import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.question}>{questions[currentQuestion]}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedOption === index && styles.selectedOption,
              ]}
              onPress={() => setSelectedOption(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.pagination}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentQuestion === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
        {currentQuestion < questions.length - 1 ? (
          <Button style = {styles.button} title="Continue" onPress={handleNext} disabled={selectedOption === null} />
        ) : (
          <Button  style = {styles.button} title="Submit Feedback" onPress={handleSubmit} />
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
  button :{
    backgroundColor:'#cc0077',
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
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: '#cc0077',
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
    backgroundColor: '#ddd',
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#cc0077',
  },
});

export default Feedback;
