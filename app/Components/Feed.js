import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

const Feed = () => {
  const route = useRoute();
  const { eventId } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const fetchData = async () => {
    try {
      const response = await fetch(`https://zelesegna.com/convene/app/get_feed.php?event=${eventId}`);
      const result = await response.json();
      console.log(result);

      if (result.status === 'success') {
        setData(result.result);
      } else {
        setError('Failed to fetch the data');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: currentTheme.background }]}>
        <ActivityIndicator size="large" color={currentTheme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: currentTheme.background }]}>
        <Text style={[styles.errorText, { color: currentTheme.text }]}>Error: {error}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: currentTheme.primary }]} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderFeedItem = ({ item }) => (
    <View style={[styles.postContainer, { backgroundColor: currentTheme.secondary }]}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.pro_pic }} style={styles.profileImage} />
        <View>
          <Text style={[styles.name, { color: currentTheme.text }]}>{`${item.first_name} ${item.middle_name} ${item.last_name}`}</Text>
          <Text style={[styles.position, { color: currentTheme.text }]}>{item.position}</Text>
        </View>
      </View>
      <Text style={[styles.postText, { color: currentTheme.text }]}>{item.text_content}</Text>
      <Image source={{ uri: item.img_url }} style={styles.postImage} />
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.footerIcon}>
          <Text style={{ color: currentTheme.text }}>❤️ {item.like_count}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Text style={{ color: currentTheme.text }}>💬 {item.comment_count || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Text style={{ color: currentTheme.text }}>🔗</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderFeedItem}
      keyExtractor={(item) => item.feed_id.toString()}
      showsVerticalScrollIndicator={false}
      refreshing={loading}
      onRefresh={fetchData}
      ListHeaderComponent={() => (
        <View style={[styles.header, { backgroundColor: currentTheme.secondary }]}>
          <Text style={[styles.headerText, { color: currentTheme.text }]}>Feed</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
  },
  postContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
  },
  position: {
    color: '#666',
  },
  postText: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Feed;