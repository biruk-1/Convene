import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';

const { width } = Dimensions.get('window');

const ModernPostCard = ({ post, onLike, onComment, onShare }) => {
  const [liked, setLiked] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const maxTextLength = 150;
  const shouldTruncate = post.content && post.content.length > maxTextLength;
  const displayText = shouldTruncate && !showFullText
    ? post.content.substring(0, maxTextLength) + '...'
    : post.content;

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(post.id, !liked);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.secondary }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            {post.userImage ? (
              <Image source={{ uri: post.userImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: designTokens.colors.backgroundTertiary }]}>
                <Text style={[styles.avatarText, { color: designTokens.colors.textSecondary }]}>
                  {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: currentTheme.text }]}>
              {post.userName || 'Anonymous User'}
            </Text>
            <Text style={[styles.postTime, { color: designTokens.colors.textSecondary }]}>
              {formatDate(post.created_at)}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <Text style={[styles.moreIcon, { color: designTokens.colors.textSecondary }]}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {post.content && (
          <Text style={[styles.postText, { color: currentTheme.text }]}>
            {displayText}
            {shouldTruncate && (
              <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
                <Text style={[styles.readMoreText, { color: designTokens.colors.primary }]}>
                  {showFullText ? ' Show less' : ' Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </Text>
        )}

        {/* Image */}
        {post.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: post.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      {/* Stats */}
      {(post.likes > 0 || post.comments > 0) && (
        <View style={styles.statsContainer}>
          {post.likes > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.likeIcon}>❤️</Text>
              <Text style={[styles.statText, { color: designTokens.colors.textSecondary }]}>
                {post.likes} {post.likes === 1 ? 'like' : 'likes'}
              </Text>
            </View>
          )}
          {post.comments > 0 && (
            <Text style={[styles.statText, { color: designTokens.colors.textSecondary }]}>
              {post.comments} {post.comments === 1 ? 'comment' : 'comments'}
            </Text>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, liked && styles.actionButtonActive]}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionIcon, liked && styles.actionIconActive]}>
            {liked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, { color: designTokens.colors.textSecondary }]}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleComment}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={[styles.actionText, { color: designTokens.colors.textSecondary }]}>
            Comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={[styles.actionText, { color: designTokens.colors.textSecondary }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.borderRadius.lg,
    marginHorizontal: designTokens.spacing.lg,
    marginVertical: designTokens.spacing.sm,
    padding: designTokens.spacing.lg,
    ...designTokens.shadows.md,
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: designTokens.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: designTokens.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: designTokens.typography.lg,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: designTokens.typography.base,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
    marginBottom: designTokens.spacing.xs,
  },
  postTime: {
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
  },
  moreButton: {
    padding: designTokens.spacing.sm,
  },
  moreIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: designTokens.spacing.md,
  },
  postText: {
    fontSize: designTokens.typography.base,
    fontFamily: designTokens.typography.fontFamily,
    lineHeight: designTokens.typography.lineHeight.relaxed * designTokens.typography.base,
    marginBottom: designTokens.spacing.md,
  },
  readMoreText: {
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
  },
  imageContainer: {
    borderRadius: designTokens.borderRadius.md,
    overflow: 'hidden',
    marginTop: designTokens.spacing.sm,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: designTokens.borderRadius.md,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.borderLight,
    marginBottom: designTokens.spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: designTokens.spacing.lg,
  },
  likeIcon: {
    fontSize: 16,
    marginRight: designTokens.spacing.xs,
  },
  statText: {
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonActive: {
    backgroundColor: designTokens.colors.backgroundTertiary,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: designTokens.spacing.xs,
  },
  actionIconActive: {
    color: designTokens.colors.primary,
  },
  actionText: {
    fontSize: designTokens.typography.sm,
    fontWeight: '500',
    fontFamily: designTokens.typography.fontFamilyMedium,
  },
});

export default ModernPostCard; 