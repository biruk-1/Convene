import { StyleSheet } from 'react-native';

export const feedStyles = StyleSheet.create({
  postContainer: {
    marginVertical: 15, // Add margin to all sides for spacing between posts
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  // Profile Section (Top)
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Round profile image
    marginRight: 10,
  },
  profileTextContainer: {
    flexDirection: 'column',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileTitle: {
    fontSize: 14,
    color: '#666', // Smaller subtitle under profile name
  },

  // Post Image with Border Radius
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 15, // Rounded borders for post image
    marginVertical: 10, // Add vertical spacing between the image and other elements
  },

  // Description Section
  description: {
    marginHorizontal: 15,
    marginVertical: 5,
    fontSize: 16,
    color: '#444',
    fontFamily: 'Arial', // You can change this to your preferred font style
  },

  // Action Row for Like, Comment, Share Icons
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  // Action Buttons (Like, Comment, Share)
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
});
