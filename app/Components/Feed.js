import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal, 
  ScrollView,
  Dimensions,
  Platform 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { useEventId } from '../context/EventIdContext';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Feed = () => {
  const route = useRoute();
  const { eventId: routeEventId } = route.params || {};
  const { eventId: contextEventId } = useEventId();
  const eventId = routeEventId || contextEventId;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const fetchData = async () => {
    if (!eventId) {
      setError('Event ID is required');
      setLoading(false);
      return;
    }

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
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: currentTheme.background }]}>
        <ActivityIndicator size="large" color="#4A148C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: currentTheme.background }]}>
        <Text style={[styles.errorText, { color: currentTheme.text }]}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderFeedItem = ({ item }) => {
    const isTextExpanded = expandedPost === item.feed_id;
    const shouldShowMoreButton = item.text_content.length > 120;

    return (
      <View style={[styles.postContainer, { backgroundColor: currentTheme.background }]}>
        {/* Post Header - Full Width */}
        <View style={styles.postHeader}>
          <Image source={{ uri: item.pro_pic }} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: currentTheme.text }]}>
              {`${item.first_name} ${item.middle_name} ${item.last_name}`}
            </Text>
            <Text style={[styles.position, { color: currentTheme.text }]}>
              {item.position}
            </Text>
          </View>
        </View>
        
        {/* Post Image - Full Width */}
        {item.img_url && (
          <TouchableOpacity onPress={() => handleImagePress(item.img_url)} activeOpacity={0.9}>
            <Image source={{ uri: item.img_url }} style={styles.postImage} />
          </TouchableOpacity>
        )}

        {/* Post Text - Full Width */}
        <View style={styles.postTextContainer}>
          <Text style={[styles.postText, { color: currentTheme.text }]} numberOfLines={isTextExpanded ? undefined : 4}>
            {item.text_content}
          </Text>
          {shouldShowMoreButton && (
            <TouchableOpacity onPress={() => handleShowMoreToggle(item.feed_id)}>
              <Text style={[styles.showMoreText, { color: '#4A148C' }]}>
                {isTextExpanded ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Post Footer - Full Width Interaction Bar */}
        <View style={[styles.postFooter, { borderTopColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)' }]}>
          <TouchableOpacity style={styles.footerIcon} activeOpacity={0.7}>
                            <Ionicons name="heart" size={22} color="#FF3B30" />
            <Text style={[styles.interactionText, { color: currentTheme.text }]}>
              {item.like_count || 0}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerIcon} activeOpacity={0.7}>
                          <Ionicons name="chatbubble-outline" size={22} color={currentTheme.text} />
            <Text style={[styles.interactionText, { color: currentTheme.text }]}>
              {item.comment_count || 0}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerIcon} activeOpacity={0.7}>
                          <Ionicons name="arrow-redo-outline" size={22} color={currentTheme.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerIcon} activeOpacity={0.7}>
                          <Ionicons name="bookmark-outline" size={22} color={currentTheme.text} />
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
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]} />}
        scrollEnabled={false} // Disable scroll since parent handles it
      />

      {/* Full-Image Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                          <Ionicons name="close" size={24} color="#fff" />
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
    minHeight: 200,
  },
  errorText: {
    marginBottom: 10,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#4A148C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20, // Reduced padding to fix footer spacing
  },
  separator: {
    height: 1,
  },
  postContainer: {
    width: '100%',
    marginBottom: 0,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  position: {
    fontSize: 14,
    opacity: 0.7,
  },
  postImage: {
    width: '100%',
    height: width * 0.6, // Reduced height from 0.75 to 0.6
    resizeMode: 'cover',
    borderRadius: 12, // Added border radius to all sides
  },
  postTextContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  interactionText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullImage: {
    width: '95%',
    height: '85%',
    borderRadius: 12,
    resizeMode: 'contain',
  },
});

export default Feed;
