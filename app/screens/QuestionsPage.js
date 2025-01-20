import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

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
    fetchQuestions(
      'https://zelesegna.com/convene/app/get_questions.php?event=1&status=0',
      setUnansweredQuestions
    );
  }, []);

  // Fetch answered questions when switching to "Answers" tab
  useEffect(() => {
    if (activeTab === 'Answers') {
      fetchQuestions(
        'https://zelesegna.com/convene/app/get_questions.php?event=1&status=1',
        setAnsweredQuestions
      );
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

  const handleLike = (questionId) => {
    // Placeholder function to handle like button press
    // You can replace this with an actual API call to like the question
    console.log(`Liked question with id: ${questionId}`);
  };

  return (
    <View style={[styles.pageContainer, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: currentTheme.secondary}]}>
        <Text style={[styles.headerText, { color: currentTheme.text }]}>
          {activeTab === 'Questions' ? 'Questions' : 'Answers'}
        </Text>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: currentTheme.secondary }]}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Questions' && styles.activeTab]}
            onPress={() => handleTabChange('Questions')}
          >
            <Text style={[styles.tabText, activeTab === 'Questions' && styles.activeTabText]}>
              Questions ({unansweredQuestions.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Answers' && styles.activeTab]}
            onPress={() => handleTabChange('Answers')}
          >
            <Text style={[styles.tabText, activeTab === 'Answers' && styles.activeTabText]}>
              Answers ({answeredQuestions.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.horizontalLine} />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {activeTab === 'Questions' ? (
            unansweredQuestions.length > 0 ? (
              unansweredQuestions.map((item) => (
                <View
                  key={item.question_id}
                  style={[
                    styles.questionContainer,
                    {
                      backgroundColor: currentTheme.tertiary,
                      borderColor: currentTheme.tertiary,
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: currentTheme.primary }]}>
                    #{item.position}
                  </Text>
                  <Text style={[styles.questionText, { color: currentTheme.text }]}>
                    {item.question}
                  </Text>
                  <View style={styles.userContainer}>
                    <Image
                      source={{ uri: item.pro_pic }}
                      style={styles.userAvatar}
                    />
                    <Text style={[styles.userName, { color: currentTheme.text }]}>
                      {item.first_name} {item.last_name}
                    </Text>
                  </View>

                  {/* Like button and vote count */}
                  <View style={styles.likeContainer}>
                    <TouchableOpacity
                      style={styles.likeButton}
                      onPress={() => handleLike(item.question_id)}
                    >
                      <Icon name="heart-outline" size={20} color={currentTheme.primary} />
                      <Text style={[styles.voteText, { color: currentTheme.primary }]}>
                        {item.like_count || 0} votes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.noDataText, { color: currentTheme.text }]}>
                No questions available.
              </Text>
            )
          ) : (
            answeredQuestions.length > 0 ? (
              answeredQuestions.map((item) => (
                <View
                  key={item.question_id}
                  style={[
                    styles.answerContainer,
                    {
                      backgroundColor: currentTheme.secondary,
                      borderColor: currentTheme.primary,
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: currentTheme.primary }]}>
                    #{item.position}
                  </Text>
                  <Text style={[styles.answerText, { color: currentTheme.text }]}>
                    {item.question}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noDataText, { color: currentTheme.text }]}>
                No answers available.
              </Text>
            )
          )}

          {/* Ask a Question Button */}
          {activeTab === 'Questions' && (
            <TouchableOpacity
              style={[styles.askButton, { backgroundColor: currentTheme.primary }]}
              onPress={() => navigation.navigate('AskQuestion', { userName })}
            >
              <Text style={[styles.askButtonText, { color: currentTheme.text }]}>
                Ask a Question
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'hsl(0, 0%, 80%)',
    marginVertical: 8,
    marginTop: -28.5,
  },
  headerContainer: {
    padding: 10,
    marginBottom: -15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    

  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  questionContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 16,
    marginVertical: 5,
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
    fontSize: 14,
  },
  answerContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  voteText: {
    marginLeft: 5,
    fontSize: 14,
  },
  askButton: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 10,
  },
  activeTab: {
    borderBottomWidth: 5, // Underline thickness
    borderBottomColor: '#4f043d', // Underline color
  },
  activeTabText: {
    color: '#4f043d', 
    // Active tab text color
  },
  
});

export default QuestionsPage;
