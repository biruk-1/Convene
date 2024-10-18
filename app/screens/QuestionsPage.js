import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';

function QuestionsPage() {
  const [activeTab, setActiveTab] = useState('Questions'); // To manage active tab
  const userName = 'Abebe';
  const navigation = useNavigation()

  const questionsData = [
    {
      id: 1,
      tag: '#Marketing',
      question: 'How can we improve our social media engagement?',
      user: { name: 'John Doe', avatar: 'https://via.placeholder.com/150' },
      votes: 5,
    },
    {
      id: 2,
      tag: '#CustomerSupport',
      question: 'What are the best practices for improving customer satisfaction?',
      user: { name: 'Jane Smith', avatar: 'https://via.placeholder.com/150' },
      votes: 10,
    },
  ];

  const answersData = [
    { id: 1, answer: 'You should prioritize customer feedback for engagement.', user: 'John' },
    { id: 2, answer: 'Offer better customer support for satisfaction.', user: 'Jane' },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (

    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header Tabs with underline */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => handleTabChange('Questions')}>
          <Text style={[styles.tabText, activeTab === 'Questions' && styles.activeTabText]}>
            Questions (12)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => handleTabChange('Answers')}>
          <Text style={[styles.tabText, activeTab === 'Answers' && styles.activeTabText]}>
            Answers (5)
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.underline, activeTab === 'Answers' && styles.underlineRight]} />

      {/* Content Section */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {activeTab === 'Questions' ? (
          questionsData.map((item) => (
            <View key={item.id} style={styles.questionContainer}>
              {/* Hashtag */}
              <Text style={styles.tagText}>{item.tag}</Text>
              {/* Question Text */}
              <Text style={styles.questionText}>{item.question}</Text>
              {/* User Info and Votes */}
              <View style={styles.userContainer}>
                <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
                <Text style={styles.userName}>{item.user.name}</Text>
                <View style={styles.voteContainer}>
                  <Icon name="heart-outline" size={20} color="#fd61e3" />
                  <Text style={styles.voteCount}>{item.votes}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          answersData.map((item) => (
            <View key={item.id} style={styles.answerContainer}>
              <Text style={styles.answerText}>{item.answer}</Text>
              <Text style={styles.answerUser}>- {item.user}</Text>
            </View>
          ))
        )}

        {/* Ask Question Button */}
        {activeTab === 'Questions' && (
             <TouchableOpacity
            style={{ padding: 20, backgroundColor: '#fd61e3', borderRadius: 5 }}
            onPress={() => navigation.navigate('AskQuestion', { userName })} // Use navigation here
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Ask a Question</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Footer style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#fd61e3',
  },
  underline: {
    height: 3,
    width: '50%',
    backgroundColor: '#fd61e3',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  underlineRight: {
    left: '50%',
  },
  contentContainer: {
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  tagText: {
    color: '#3399ff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    color: '#333',
    marginRight: 20,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCount: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fd61e3',
  },
  answerContainer: {
    marginBottom: 20,
  },
  answerText: {
    fontSize: 16,
    marginBottom: 5,
  },
  answerUser: {
    fontSize: 14,
    color: '#999',
  },
  askButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#fd61e3',
    alignItems: 'center',
    borderRadius: 5,
  },
  askButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
export default QuestionsPage;