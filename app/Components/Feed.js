import React from 'react';
import { FlatList, View, StyleSheet, ScrollView } from 'react-native';
import PostCard from './PostCard';
import postsData from '../Data/posts.json'; // Assuming you will create a posts.json for posts data

const Feed = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={postsData} // Array of posts
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id.toString()} // Unique key for each item
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Feed;
