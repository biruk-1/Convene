import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';

function QuestionsPage() {
  const [activeTab, setActiveTab] = useState('Questions');
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const userName = 'Abebe';
  const navigation = useNavigation();

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
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {activeTab === 'Questions' ? 'Questions' : 'Answers'}
        </Text>
      </View>

      <View style={styles.contentContainer}>
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

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {activeTab === 'Questions' ? (
            unansweredQuestions.map((item) => (
              <View key={item.question_id} style={styles.questionContainer}>
                <Text style={styles.tagText}>#{item.position}</Text>
                <Text style={styles.questionText}>{item.question}</Text>
                <View style={styles.userContainer}>
                  <Image source={{ uri: item.pro_pic }} style={styles.userAvatar} />
                  <Text style={styles.userName}>{`${item.first_name} ${item.last_name}`}</Text>
                  <View style={styles.voteContainer}>
                    <Icon name="heart-outline" size={20} color="#fd61e3" />
                    <Text style={styles.voteCount}>{item.votes || 0}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            answeredQuestions.map((item) => (
              <View key={item.question_id} style={styles.answerContainer}>
                <Text style={styles.tagText}>#{item.position}</Text>
                <Text style={styles.answerText}>{item.question}</Text>
                <Text style={styles.answerUser}>Answered by {item.first_name} {item.last_name}</Text>
              </View>
            ))
          )}

          {activeTab === 'Questions' && (
            <TouchableOpacity
              style={styles.askButton}
              onPress={() => navigation.navigate('AskQuestion', { userName })}
            >
              <Text style={styles.askButtonText}>Ask a Question</Text>
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
    backgroundColor: '#f0f0f0',
  },
  headerContainer: {
    backgroundColor: '#cc0077',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f5f5f5',
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
  activeTab: {
    backgroundColor: '#cc0077',
    borderColor: '#cc0077',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1
  },
  questionContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tagText: {
    color: '#3399ff',
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
    color: '#cc0077',
  },
  answerContainer: {
    marginBottom: 20,
  },
  answerText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
  },
  answerUser: {
    fontSize: 14,
    color: '#999',
  },
  askButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#cc0077',
    alignItems: 'center',
    borderRadius: 10,
  },
  askButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 10,
  },
});

export default QuestionsPage;




// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import Footer from '../Components/Footer';
// import questionsData from '../Data/quastions.json'; // Importing local JSON data

// function QuestionsPage() {
//   const [activeTab, setActiveTab] = useState('Questions');
//   const [unansweredQuestions, setUnansweredQuestions] = useState([]);
//   const [answeredQuestions, setAnsweredQuestions] = useState([]);
//   const userName = 'Abebe';
//   const navigation = useNavigation();

//   // Use local data for unanswered questions
//   useEffect(() => {
//     // Simulate fetching unanswered questions from local JSON
//     setUnansweredQuestions(questionsData.unanswered || []);
//   }, []);

//   // Simulate fetching answered questions when switching to "Answers" tab
//   useEffect(() => {
//     if (activeTab === 'Answers') {
//       setAnsweredQuestions(questionsData.answered || []);
//     }
//   }, [activeTab]);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <View style={styles.pageContainer}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}>
//           {activeTab === 'Questions' ? 'Questions' : 'Answers'}
//         </Text>
//       </View>

//       <View style={styles.contentContainer}>
//         <View style={styles.tabsContainer}>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'Questions' && styles.activeTab]}
//             onPress={() => handleTabChange('Questions')}
//           >
//             <Text style={[styles.tabText, activeTab === 'Questions' && styles.activeTabText]}>
//               Questions ({unansweredQuestions.length})
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'Answers' && styles.activeTab]}
//             onPress={() => handleTabChange('Answers')}
//           >
//             <Text style={[styles.tabText, activeTab === 'Answers' && styles.activeTabText]}>
//               Answers ({answeredQuestions.length})
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {activeTab === 'Questions' ? (
//             unansweredQuestions.map((item) => (
//               <View key={item.question_id} style={styles.questionContainer}>
//                 <Text style={styles.tagText}>#{item.position}</Text>
//                 <Text style={styles.questionText}>{item.question}</Text>
//                 <View style={styles.userContainer}>
//                   <Image source={{ uri: item.pro_pic }} style={styles.userAvatar} />
//                   <Text style={styles.userName}>{`${item.first_name} ${item.last_name}`}</Text>
//                   <View style={styles.voteContainer}>
//                     <Icon name="heart-outline" size={20} color="#fd61e3" />
//                     <Text style={styles.voteCount}>{item.votes || 0}</Text>
//                   </View>
//                 </View>
//               </View>
//             ))
//           ) : (
//             answeredQuestions.map((item) => (
//               <View key={item.question_id} style={styles.answerContainer}>
//                 <Text style={styles.tagText}>#{item.position}</Text>
//                 <Text style={styles.answerText}>{item.question}</Text>
//                 <Text style={styles.answerUser}>Answered by {item.first_name} {item.last_name}</Text>
//               </View>
//             ))
//           )}

//           {activeTab === 'Questions' && (
//             <TouchableOpacity
//               style={styles.askButton}
//               onPress={() => navigation.navigate('AskQuestion', { userName })}
//             >
//               <Text style={styles.askButtonText}>Ask a Question</Text>
//             </TouchableOpacity>
//           )}
//         </ScrollView>
//       </View>
//       <Footer style={styles.footer} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   pageContainer: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   headerContainer: {
//     backgroundColor: '#cc0077',
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 32,
//     fontWeight: 'bold',
//     fontFamily: 'Poppins-Bold',
//   },
//   contentContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 30,
//     padding: 20,
//     marginTop: -20,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     marginBottom: 20,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderRadius: 20,
//     borderColor: '#ccc',
//     borderWidth: 1,
//   },
//   activeTab: {
//     backgroundColor: '#cc0077',
//     borderColor: '#cc0077',
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#333',
//     fontFamily: 'Roboto-Regular',
//   },
//   activeTabText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//     height: 400,
//   },
//   questionContainer: {
//     marginBottom: 20,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   tagText: {
//     color: '#3399ff',
//     fontWeight: 'bold',
//     marginBottom: 5,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   questionText: {
//     fontSize: 18,
//     marginBottom: 10,
//     fontFamily: 'Roboto-Regular',
//     textAlign: 'left',
//   },
//   userContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 16,
//     color: '#333',
//     marginRight: 20,
//     fontFamily: 'Roboto-Regular',
//   },
//   voteContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   voteCount: {
//     marginLeft: 5,
//     fontSize: 14,
//     color: '#cc0077',
//   },
//   answerContainer: {
//     marginBottom: 20,
//   },
//   answerText: {
//     fontSize: 16,
//     marginBottom: 5,
//     fontFamily: 'Roboto-Regular',
//     textAlign: 'left',
//   },
//   answerUser: {
//     fontSize: 14,
//     color: '#999',
//     fontFamily: 'Roboto-Light',
//   },
//   askButton: {
//     marginTop: 20,
//     paddingVertical: 15,
//     backgroundColor: '#cc0077',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   askButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontFamily: 'Poppins-Medium',
//   },
//   footer: {
//     marginTop: 10,
//   },
// });

// export default QuestionsPage;

