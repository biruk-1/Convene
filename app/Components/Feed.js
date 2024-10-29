import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../screens/AuthContext';

const Feed = () => {
  const [data, setData] = useState([]);  // State to store fetched data
  const [loading, setLoading] = useState(true);  // State to manage loading indicator
  const [error, setError] = useState(null);  // State to handle errors

  const fetchData = async () => {
    try {
      const response = await fetch('https://zelesegna.com/convene/app/get_feed.php?event=1');
      const result = await response.json();  // Parse the JSON response
      console.log(result);  // Log the result to see structure

      // The correct field is result.result, not result.feed
      if (result.status === 'success') {
        setData(result.result);  // Update state with the correct data
      } else {
        setError('Failed to fetch the data');  // Handle a case where status isn't success
      }
    } catch (err) {
      console.error("Fetch error:", err);  // Log any errors during fetch
      setError(err.message);  // Store error in state
    } finally {
      setLoading(false);  // Stop the loading spinner
    }
  };

  useEffect(() => {
    fetchData();  // Call the function to fetch data when the component is mounted
  }, []);  // Empty dependency array ensures this effect runs once when the component is mounted

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderFeedItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.pro_pic }} style={styles.profileImage} />
        <View>
          <Text style={styles.name}>{`${item.first_name} ${item.middle_name} ${item.last_name}`}</Text>
          <Text style={styles.position}>{item.position}</Text>
        </View>
      </View>
      <Text style={styles.postText}>{item.text_content}</Text>
      <Image source={{ uri: item.img_url }} style={styles.postImage} />
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.footerIcon}>
          <Text>❤️ {item.like_count}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Text>💬 {item.comment_count || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Text>🔗</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data} // Correctly use the state variable 'data'
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.feed_id.toString()}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#cc0077',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  position: {
    fontSize: 12,
    color: '#666',
  },
  postText: {
    marginBottom: 10,
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  footerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Feed;


// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// import postsData from '../Data/posts.json';  // Import the JSON file directly

// const Feed = () => {
//   const [data, setData] = useState([]);  // State to store fetched data
//   const [loading, setLoading] = useState(true);  // State to manage loading indicator
//   const [error, setError] = useState(null);  // State to handle errors

//   useEffect(() => {
//     // Simulate the fetchData function but instead use the local JSON file
//     try {
//       setData(postsData.result);  // Use data from the imported JSON file
//     } catch (err) {
//       console.error("Data load error:", err);  // Log any errors during load
//       setError(err.message);  // Store error in state
//     } finally {
//       setLoading(false);  // Stop the loading spinner
//     }
//   }, []);  // Empty dependency array ensures this effect runs once when the component is mounted

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true)}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const renderFeedItem = ({ item }) => (
//     <View style={styles.postContainer}>
//       <View style={styles.postHeader}>
//         <Image source={{ uri: item.pro_pic }} style={styles.profileImage} />
//         <View>
//           <Text style={styles.name}>{`${item.first_name} ${item.middle_name} ${item.last_name}`}</Text>
//           <Text style={styles.position}>{item.position}</Text>
//         </View>
//       </View>
//       <Text style={styles.postText}>{item.text_content}</Text>
//       <Image source={{ uri: item.img_url }} style={styles.postImage} />
//       <View style={styles.postFooter}>
//         <TouchableOpacity style={styles.footerIcon}>
//           <Text>❤️ {item.like_count}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerIcon}>
//           <Text>💬 {item.comment_count || 0}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerIcon}>
//           <Text>🔗</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data} // Correctly use the state variable 'data'
//         renderItem={renderFeedItem}
//         keyExtractor={(item) => item.feed_id.toString()}
//         showsVerticalScrollIndicator={false}
//         refreshing={loading}
//         onRefresh={() => setLoading(true)}  // Trigger reloading by resetting the loading state
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#cc0077',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   postContainer: {
//     backgroundColor: '#fff',
//     marginBottom: 10,
//     padding: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   postHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   name: {
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   position: {
//     fontSize: 12,
//     color: '#666',
//   },
//   postText: {
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   postImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   postFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 5,
//   },
//   footerIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

// export default Feed;
