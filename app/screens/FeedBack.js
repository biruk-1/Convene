import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

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
  const navigation = useNavigation();

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
    
    // Show success alert
    Alert.alert(
      'Success!',
      'Thank you for your feedback!',
      [
        {
          text: 'OK',
          onPress: () => {
            // User can navigate back manually
          }
        }
      ],
      { cancelable: false }
    );
  };

  const getOptionColor = (index) => {
    if (selectedOption === index) {
      return '#4A148C';
    }
    return theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  };

  const getOptionTextColor = (index) => {
    if (selectedOption === index) {
      return '#FFFFFF';
    }
    return currentTheme.text;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.background}
      />

      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: currentTheme.background }]}>
        {/* Top Row with App Name and Icons */}
        <View style={styles.headerTopRow}>
          <Text style={[styles.appName, { color: currentTheme.text }]}>Convene</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={22} color={currentTheme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                              <Ionicons name="download-outline" size={22} color={currentTheme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feedback Title */}
        <Text style={[styles.feedbackTitle, { color: currentTheme.text }]}>Feedback</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  backgroundColor: '#4A148C'
                }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: currentTheme.text }]}>
            {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        {/* Question Card */}
        <View style={[styles.questionCard, { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
          <Ionicons name="help-circle-outline" size={32} color="#4A148C" style={styles.questionIcon} />
          <Text style={[styles.question, { color: currentTheme.text }]}>
            {questions[currentQuestion]}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                {
                  backgroundColor: getOptionColor(index),
                  borderColor: selectedOption === index ? '#4A148C' : 'rgba(0, 0, 0, 0.1)'
                },
              ]}
              onPress={() => setSelectedOption(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, { color: getOptionTextColor(index) }]}>
                {option}
              </Text>
              {selectedOption === index && (
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: currentQuestion === index 
                    ? '#4A148C' 
                    : theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : 'rgba(0, 0, 0, 0.2)',
                  transform: [{ scale: currentQuestion === index ? 1.2 : 1 }]
                },
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: selectedOption !== null ? '#4A148C' : 'rgba(0, 0, 0, 0.1)',
              opacity: selectedOption !== null ? 1 : 0.5
            }
          ]}
          onPress={currentQuestion < questions.length - 1 ? handleNext : handleSubmit}
          disabled={selectedOption === null}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionButtonText, { color: selectedOption !== null ? '#FFFFFF' : currentTheme.text }]}>
            {currentQuestion < questions.length - 1 ? 'Continue' : 'Submit Feedback'}
          </Text>
                     <Ionicons
             name={currentQuestion < questions.length - 1 ? "arrow-forward" : "checkmark"}
             size={20}
             color={selectedOption !== null ? '#FFFFFF' : currentTheme.text}
             style={styles.buttonIcon}
           />
        </TouchableOpacity>
      </ScrollView>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: Platform.OS === 'ios' ? 4 : 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 6,
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  questionCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  questionIcon: {
    marginBottom: 16,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default Feedback;