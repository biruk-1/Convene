import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEventId } from '../context/EventIdContext';

import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

const { width, height } = Dimensions.get('window');

function QuestionsPage() {
  const [activeTab, setActiveTab] = useState('Questions');
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const userName = 'Abebe';
  const navigation = useNavigation();
  const { eventId } = useEventId();

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Fetch unanswered questions when component mounts
  useEffect(() => {
    if (eventId) {
      fetchQuestions(
        `https://zelesegna.com/convene/app/get_questions.php?event=${eventId}&status=0`,
        setUnansweredQuestions
      );
    }
  }, [eventId]);

  // Fetch answered questions when switching to "Answers" tab
  useEffect(() => {
    if (activeTab === 'Answers' && eventId) {
      fetchQuestions(
        `https://zelesegna.com/convene/app/get_questions.php?event=${eventId}&status=1`,
        setAnsweredQuestions
      );
    }
  }, [activeTab, eventId]);

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
    <SafeAreaView style={[styles.pageContainer, { backgroundColor: currentTheme.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={currentTheme.background} 
      />
      
      {/* Header Section - Matching FeedScreen and CalendarView */}
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
        
                 {/* Dynamic Title based on active tab */}
         <Text style={[styles.questionsTitle, { color: currentTheme.text }]}>
           {activeTab === 'Questions' ? 'Questions' : 'Answers'}
         </Text>
       </View>

       <View style={[styles.contentContainer, { backgroundColor: currentTheme.background }]}>
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
             Answered ({answeredQuestions.length})
           </Text>
         </TouchableOpacity>
        </View>

        <View style={styles.horizontalLine} />

        <FlatList
          data={activeTab === 'Questions' ? unansweredQuestions : answeredQuestions}
          renderItem={({ item }) => (
            <View
              style={[
                activeTab === 'Questions' ? styles.questionContainer : styles.answerContainer,
                {
                  backgroundColor: activeTab === 'Questions' ? currentTheme.tertiary : currentTheme.secondary,
                  borderColor: activeTab === 'Questions' ? currentTheme.tertiary : currentTheme.primary,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: currentTheme.primary }]}>
                #{item.position}
              </Text>
              <Text style={[styles.questionText, { color: currentTheme.text }]}>
                {item.question}
              </Text>
              {activeTab === 'Answers' && (
                <Text style={[styles.answerText, { color: currentTheme.text }]}>
                  {item.answer}
                </Text>
              )}
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
                  <Ionicons name="heart-outline" size={20} color={currentTheme.primary} />
                  <Text style={[styles.voteText, { color: currentTheme.primary }]}>
                    {item.like_count || 0} votes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.question_id.toString()}
          showsVerticalScrollIndicator={false}
                     ListEmptyComponent={() => (
             <View style={styles.emptyContainer}>
               <Text style={styles.catEmoji}>🐱</Text>
               <Text style={[styles.emptyText, { color: currentTheme.text }]}>
                 {activeTab === 'Questions' ? 'No questions available' : 'No answers available'}
               </Text>
               <Text style={[styles.emptySubtext, { color: currentTheme.text }]}>
                 {activeTab === 'Questions' ? 'Be the first to ask a question!' : 'Check back later for answers'}
               </Text>
             </View>
           )}
          ListFooterComponent={() => (
            activeTab === 'Questions' ? (
              <TouchableOpacity
                style={[styles.askButton, { backgroundColor: currentTheme.primary }]}
                onPress={() => navigation.navigate('AskQuestion', { userName })}
              >
                <Text style={[styles.askButtonText, { color: '#ffffff' }]}>
                  Ask a Question
                </Text>
              </TouchableOpacity>
            ) : null
          )}
          contentContainerStyle={styles.scrollContainer}
        />
      </View>
      
    </SafeAreaView>
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
  questionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 4,
  },
  tab: {
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  scrollContainer: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
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
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeTab: {
    borderBottomColor: '#4A148C',
  },
  activeTabText: {
    color: '#4A148C',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  catEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  
});

export default QuestionsPage;
