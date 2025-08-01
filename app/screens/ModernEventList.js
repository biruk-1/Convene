import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, StyleSheet, Animated } from 'react-native';
import { useEventId } from '../context/EventIdContext';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';
import { ListItemSkeleton, ModernSpinner } from '../Components/ModernLoading';

const ModernEventList = ({ navigation, route }) => {
  const { participantId } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { setEventId } = useEventId();
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const fetchEvents = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const formData = new FormData();
      formData.append('user', participantId);

      const response = await fetch('https://zelesegna.com/convene/app/get_user_event.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Network response was not ok');
        Alert.alert('Failed to load events', 'Please try again later.');
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Unexpected response format:', responseText);
        Alert.alert('Failed to load events', 'Unexpected response format from the server.');
        return;
      }

      const eventData = await response.json();

      if (eventData.status === 'success' && Array.isArray(eventData.result)) {
        setEvents(eventData.result);
      } else {
        Alert.alert('Failed to load events', eventData.result || 'Invalid request.');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error loading events', 'Please check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [participantId]);

  const handleRefresh = () => {
    fetchEvents(true);
  };

  const handleEventPress = (event) => {
    setEventId(event.event_id);
    navigation.navigate('Feed', { eventId: event.event_id });
  };

  const renderEventItem = ({ item, index }) => {
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

    React.useEffect(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim, index]);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <TouchableOpacity
          style={[styles.eventCard, { backgroundColor: currentTheme.secondary }]}
          onPress={() => handleEventPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.eventHeader}>
            <View style={styles.eventIconContainer}>
              <Text style={styles.eventIcon}>📅</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={[styles.eventTitle, { color: currentTheme.text }]}>
                {String(item.event_name)}
              </Text>
              <Text style={[styles.eventOrganisation, { color: designTokens.colors.textSecondary }]}>
                {String(item.organisation)}
              </Text>
            </View>
            <View style={styles.eventArrow}>
              <Text style={[styles.arrowText, { color: designTokens.colors.textSecondary }]}>›</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateIcon, { color: designTokens.colors.textSecondary }]}>📅</Text>
      <Text style={[styles.emptyStateTitle, { color: currentTheme.text }]}>
        No Events Found
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: designTokens.colors.textSecondary }]}>
        You don't have any upcoming events at the moment.
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ModernSpinner size="large" />
      <Text style={[styles.loadingText, { color: designTokens.colors.textSecondary }]}>
        Loading events...
      </Text>
    </View>
  );

  if (loading) {
    return renderLoadingState();
  }

  return (
    <View style={[modernStyles.container, { backgroundColor: currentTheme.background }]}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.title, { color: currentTheme.text }]}>Upcoming Events</Text>
        <Text style={[styles.subtitle, { color: designTokens.colors.textSecondary }]}>
          {events.length} event{events.length !== 1 ? 's' : ''} found
        </Text>
      </Animated.View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.event_id.toString()}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.lg,
  },
  title: {
    fontSize: designTokens.typography['2xl'],
    fontWeight: '700',
    fontFamily: designTokens.typography.fontFamilyBold,
    marginBottom: designTokens.spacing.xs,
  },
  subtitle: {
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
  },
  listContainer: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.xl,
  },
  eventCard: {
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginVertical: designTokens.spacing.xs,
    ...designTokens.shadows.md,
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: designTokens.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: designTokens.spacing.md,
  },
  eventIcon: {
    fontSize: 20,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: designTokens.typography.lg,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
    marginBottom: designTokens.spacing.xs,
  },
  eventOrganisation: {
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
  },
  eventArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: designTokens.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: designTokens.spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: designTokens.spacing['4xl'],
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: designTokens.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: designTokens.typography.xl,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
    marginBottom: designTokens.spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: designTokens.typography.base,
    fontFamily: designTokens.typography.fontFamily,
    textAlign: 'center',
    lineHeight: designTokens.typography.lineHeight.relaxed * designTokens.typography.base,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: designTokens.typography.base,
    fontFamily: designTokens.typography.fontFamily,
    marginTop: designTokens.spacing.lg,
  },
});

export default ModernEventList; 