// import React from 'react';
// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import PropTypes from 'prop-types'; // Import PropTypes for validation
// import { feedStyles } from '../styles/feedStyles';

// // Mapping image names to their respective files
// const images = {
//   hick1: require('../Images/hick 1.jpg'),   
//   hick2: require('../Images/hick 2.jpg'),   
// };

// const PostCard = ({ post }) => {
//   return (
//     <View style={feedStyles.postContainer}>
//       {/* Profile Section */}
//       <View style={feedStyles.profileContainer}>
//         <Image source={images[post.profileImage]} style={feedStyles.profileImage} />
//         <View style={feedStyles.profileTextContainer}>
//           <Text style={feedStyles.profileName}>{post.profileName}</Text>
//           <Text style={feedStyles.profileTitle}>{post.profileTitle}</Text> {/* Subtitle under profile name */}
//         </View>
//       </View>
      
//       {/* Post Image */}
//       <Image source={images[post.postImage]} style={feedStyles.postImage} />

//       {/* Description */}
//       <Text style={feedStyles.description}>{post.description}</Text>

//       {/* Action Row */}
//       <View style={feedStyles.actionRow}>
//         {/* Like Button */}
//         <TouchableOpacity style={feedStyles.actionButton}>
//           <Icon name="heart-outline" size={25} style={feedStyles.actionIcon} />
//           <Text style={feedStyles.actionText}>{post.likes} Likes</Text>
//         </TouchableOpacity>

//         {/* Comment Button */}
//         <TouchableOpacity style={feedStyles.actionButton}>
//           <Icon name="chatbubble-outline" size={25} style={feedStyles.actionIcon} />
//           <Text style={feedStyles.actionText}>{post.comments.length} Comments</Text>
//         </TouchableOpacity>

//         {/* Share Button */}
//         <TouchableOpacity style={feedStyles.actionButton}>
//           <Icon name="share-outline" size={25} style={feedStyles.actionIcon} />
//           <Text style={feedStyles.actionText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// // PropTypes validation
// PostCard.propTypes = {
//   post: PropTypes.shape({
//     profileImage: PropTypes.string.isRequired,
//     profileName: PropTypes.string.isRequired,
//     profileTitle: PropTypes.string.isRequired,  // New field for profile title
//     postImage: PropTypes.string.isRequired,
//     description: PropTypes.string.isRequired,
//     likes: PropTypes.number.isRequired,
//     comments: PropTypes.arrayOf(PropTypes.object).isRequired,
//   }).isRequired,
// };

// export default PostCard;


import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PostCard = ({ post }) => {
  return (
    <View style={styles.card}>
      {/* Header with profile picture and user info */}
      <View style={styles.header}>
        <Image
          style={styles.profilePic}
          source={{ uri: post.pro_pic }}  // Profile picture
        />
        <View>
          <Text style={styles.username}>
            {post.first_name} {post.middle_name} {post.last_name}
          </Text>
          <Text style={styles.position}>{post.position}</Text>
        </View>
      </View>

      {/* Post image */}
      <Image
        style={styles.postImage}
        source={{ uri: post.img_url }}   // Post image
      />

      {/* Post text content */}
      <View style={styles.textContent}>
        <Text>{post.text_content}</Text>
      </View>

      {/* Footer with likes and posted date */}
      <View style={styles.footer}>
        <Text>{post.like_count} Likes</Text>
        <Text>Posted on: {post.posted_on}</Text>
      </View>

      {/* Like button */}
      <TouchableOpacity style={styles.likeButton}>
        <Text style={styles.likeButtonText}>Like</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  position: {
    color: '#888',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  textContent: {
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  likeButton: {
    backgroundColor: '#3498db',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  likeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostCard;
