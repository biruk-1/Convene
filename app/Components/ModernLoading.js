import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';

const { width } = Dimensions.get('window');

// Shimmer effect component
const Shimmer = ({ width, height, borderRadius = 8 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.shimmerContainer, { width, height, borderRadius }]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity,
            width: width * 2,
            height,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

// Skeleton loader for cards
export const CardSkeleton = () => (
  <View style={[modernStyles.card, styles.skeletonCard]}>
    <View style={styles.skeletonHeader}>
      <Shimmer width={50} height={50} borderRadius={25} />
      <View style={styles.skeletonTextContainer}>
        <Shimmer width={width * 0.4} height={16} />
        <Shimmer width={width * 0.3} height={14} />
      </View>
    </View>
    <Shimmer width="100%" height={100} />
    <View style={styles.skeletonFooter}>
      <Shimmer width={80} height={20} />
      <Shimmer width={60} height={20} />
    </View>
  </View>
);

// Skeleton loader for list items
export const ListItemSkeleton = () => (
  <View style={[modernStyles.listItem, styles.skeletonListItem]}>
    <View style={styles.skeletonHeader}>
      <Shimmer width={40} height={40} borderRadius={20} />
      <View style={styles.skeletonTextContainer}>
        <Shimmer width={width * 0.5} height={16} />
        <Shimmer width={width * 0.3} height={14} />
      </View>
    </View>
  </View>
);

// Modern spinner component
export const ModernSpinner = ({ size = 'medium', color = designTokens.colors.primary }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerSize = size === 'small' ? 20 : size === 'large' ? 40 : 30;

  return (
    <View style={[styles.spinnerContainer, { width: spinnerSize, height: spinnerSize }]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderColor: color,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
};

// Full screen loading component
export const FullScreenLoader = ({ message = 'Loading...' }) => (
  <View style={modernStyles.loadingContainer}>
    <ModernSpinner size="large" />
    <View style={styles.loadingTextContainer}>
      <Shimmer width={120} height={20} />
    </View>
  </View>
);

// Pulse animation component
export const PulseAnimation = ({ children, delay = 0 }) => {
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 0.8,
          duration: 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseValue, delay]);

  return (
    <Animated.View style={{ opacity: pulseValue }}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shimmerContainer: {
    backgroundColor: designTokens.colors.backgroundTertiary,
    overflow: 'hidden',
  },
  shimmer: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    transform: [{ translateX: -width }],
  },
  skeletonCard: {
    marginHorizontal: designTokens.spacing.lg,
  },
  skeletonListItem: {
    marginHorizontal: designTokens.spacing.lg,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  skeletonTextContainer: {
    marginLeft: designTokens.spacing.md,
    flex: 1,
    gap: designTokens.spacing.xs,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: designTokens.spacing.md,
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRadius: 9999,
  },
  loadingTextContainer: {
    marginTop: designTokens.spacing.lg,
    alignItems: 'center',
  },
});

export default {
  CardSkeleton,
  ListItemSkeleton,
  ModernSpinner,
  FullScreenLoader,
  PulseAnimation,
  Shimmer,
}; 