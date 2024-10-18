import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import { feedStyles } from '../styles/feedStyles';

// Mapping image names to their respective files
const images = {
  hick1: require('../Images/hick 1.jpg'),   
  hick2: require('../Images/hick 2.jpg'),   
};

const PostCard = ({ post }) => {
  return (
    <View style={feedStyles.postContainer}>
      {/* Profile Section */}
      <View style={feedStyles.profileContainer}>
        <Image source={images[post.profileImage]} style={feedStyles.profileImage} />
        <View style={feedStyles.profileTextContainer}>
          <Text style={feedStyles.profileName}>{post.profileName}</Text>
          <Text style={feedStyles.profileTitle}>{post.profileTitle}</Text> {/* Subtitle under profile name */}
        </View>
      </View>
      
      {/* Post Image */}
      <Image source={images[post.postImage]} style={feedStyles.postImage} />

      {/* Description */}
      <Text style={feedStyles.description}>{post.description}</Text>

      {/* Action Row */}
      <View style={feedStyles.actionRow}>
        {/* Like Button */}
        <TouchableOpacity style={feedStyles.actionButton}>
          <Icon name="heart-outline" size={25} style={feedStyles.actionIcon} />
          <Text style={feedStyles.actionText}>{post.likes} Likes</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity style={feedStyles.actionButton}>
          <Icon name="chatbubble-outline" size={25} style={feedStyles.actionIcon} />
          <Text style={feedStyles.actionText}>{post.comments.length} Comments</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={feedStyles.actionButton}>
          <Icon name="share-outline" size={25} style={feedStyles.actionIcon} />
          <Text style={feedStyles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// PropTypes validation
PostCard.propTypes = {
  post: PropTypes.shape({
    profileImage: PropTypes.string.isRequired,
    profileName: PropTypes.string.isRequired,
    profileTitle: PropTypes.string.isRequired,  // New field for profile title
    postImage: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default PostCard;
