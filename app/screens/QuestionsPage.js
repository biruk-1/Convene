import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

function QuestionsPage() {
  const [activeTab, setActiveTab] = useState('Questions');
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const userName = 'Abebe';
  const navigation = useNavigation();

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Fetch unanswered questions when component mounts
  useEffect(() => {
    fetchQuestions('https://zelesegna.com/convene/app/get_questions.php?event=1&status=0', setUnansweredQuestions);
  }, []);

  // Fetch answered questions when switching to "Answers" tab
  useEffect(() => {
    if (activeTab === 'Answers') {
      fetchQuestions('https://zelesegna.com/convene/app/get_questions.php?event=1&status=1', setAnsweredQuestions);
    }
  }, [activeTab]);

  const fetchQuestions = async (url, updateState) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      updateState(data.result || []);
    } catch (error) {
      console.error('Error fetching questions:', error.message);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={[styles.pageContainer, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: currentTheme.primary }]}>
        <Text style={[styles.headerText, { color: currentTheme.text }]}>
          {activeTab === 'Questions' ? 'Questions' : 'Answers'}
        </Text>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: currentTheme.secondary }]}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Questions' && { backgroundColor: currentTheme.primary }]}
            onPress={() => handleTabChange('Questions')}
          >
            <Text style={[styles.tabText, activeTab === 'Questions' && { color: currentTheme.text }]}>
              Questions ({unansweredQuestions.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Answers' && { backgroundColor: currentTheme.primary }]}
            onPress={() => handleTabChange('Answers')}
          >
            <Text style={[styles.tabText, activeTab === 'Answers' && { color: currentTheme.text }]}>
              Answers ({answeredQuestions.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {activeTab === 'Questions' ? (
            unansweredQuestions.map((item) => (
              <View key={item.question_id} style={[styles.questionContainer, { backgroundColor: currentTheme.secondary, borderColor: currentTheme.primary }]}>
                <Text style={[styles.tagText, { color: currentTheme.primary }]}>#{item.position}</Text>
                <Text style={[styles.questionText, { color: currentTheme.text }]}>{item.question}</Text>
                <View style={styles.userContainer}>
                  <Image source={{ uri: item.pro_pic }} style={styles.userAvatar} />
                  <Text style={[styles.userName, { color: currentTheme.text }]}>{`${item.first_name} ${item.last_name}`}</Text>
                  <View style={styles.voteContainer}>
                    <Icon name="heart-outline" size={20} color={currentTheme.primary} />
                    <Text style={[styles.voteCount, { color: currentTheme.primary }]}>{item.votes || 0}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            answeredQuestions.map((item) => (
              <View key={item.question_id} style={[styles.answerContainer, { backgroundColor: currentTheme.secondary, borderColor: currentTheme.primary }]}>
                <Text style={[styles.tagText, { color: currentTheme.primary }]}>#{item.position}</Text>
                <Text style={[styles.answerText, { color: currentTheme.text }]}>{item.question}</Text>
                <Text style={[styles.answerUser, { color: currentTheme.text }]}>Answered by {item.first_name} {item.last_name}</Text>
              </View>
            ))
          )}

          {activeTab === 'Questions' && (
            <TouchableOpacity
              style={[styles.askButton, { backgroundColor: currentTheme.primary }]}
              onPress={() => navigation.navigate('AskQuestion', { userName })}
            >
              <Text style={[styles.askButtonText, { color: currentTheme.text }]}>Ask a Question</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
      <Footer style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    borderRadius: 30,
    padding: 20,
    marginTop: -20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  tabText: {
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1
  },
  questionContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2, // Add border width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tagText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    marginRight: 20,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCount: {
    marginLeft: 5,
    fontSize: 14,
  },
  answerContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2, // Add border width
  },
  answerText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
  },
  answerUser: {
    fontSize: 14,
  },
  askButton: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  askButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 10,
  },
});

export default QuestionsPage;