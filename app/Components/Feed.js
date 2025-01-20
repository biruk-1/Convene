import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

const Feed = () => {
  const route = useRoute();
  const { eventId } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null); // Track expanded post for "Show More"

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

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleShowMoreToggle = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId); // Toggle expand/collapse
  };

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

  const renderFeedItem = ({ item }) => {
    const isTextExpanded = expandedPost === item.feed_id;
    const shouldShowMoreButton = item.text_content.length > 120; // Adjust limit for "Show More"

    return (
      <View style={[styles.postContainer, { backgroundColor: currentTheme.secondary }]}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.pro_pic }} style={styles.profileImage} />
          <View>
            <Text style={[styles.name, { color: currentTheme.text }]}>{`${item.first_name} ${item.middle_name} ${item.last_name}`}</Text>
            <Text style={[styles.position, { color: currentTheme.text }]}>{item.position}</Text>
          </View>
        </View>
        
        {/* Post Image with Full-Screen Modal */}
        {item.img_url && (
          <TouchableOpacity onPress={() => handleImagePress(item.img_url)}>
            <Image source={{ uri: item.img_url }} style={styles.postImage} />
          </TouchableOpacity>
        )}

          {/* Post Text with "Show More" */}
          <Text style={[styles.postText, { color: currentTheme.text }]} numberOfLines={isTextExpanded ? undefined : 4}>
          {item.text_content}
        </Text>
        {shouldShowMoreButton && (
          <TouchableOpacity onPress={() => handleShowMoreToggle(item.feed_id)}>
            <Text style={[styles.showMoreText, { color: currentTheme.primary }]}>
              {isTextExpanded ? 'Show Less' : 'Show More'}
            </Text>
          </TouchableOpacity>
        )}

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
  };

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.feed_id.toString()}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchData}
        // ListHeaderComponent={() => (
        //   <View style={[styles.header, { backgroundColor: currentTheme.secondary }]}>
        //     <Text style={[styles.headerText, { color: currentTheme.text }]}>Feed</Text>
        //   </View>
        // )}
      />

      {/* Full-Image Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          )}
        </View>
      </Modal>
    </>
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
    fontSize: 16,
  },
  retryButton: {
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
  },
  postContainer: {
    marginBottom: 5,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 14,
    color: '#888',
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  showMoreText: {
    fontSize: 14,
    marginTop: 4,
  },
  postImage: {
    width: '100%',
    height: 230,
    borderRadius: 8,
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    marginTop: 25,
  },
  footerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  header: {
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  fullImage: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
});

export default Feed;
