// app/screens/EventList.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEventId } from '../context/EventIdContext';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

const { width, height } = Dimensions.get('window');

const EventList = ({ navigation, route }) => {
  const { participantId } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setEventId } = useEventId();
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
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
      }
    };

    fetchEvents();
  }, [participantId]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.eventCard,
        {
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(74, 20, 140, 0.2)',
          borderWidth: 2,
        }
      ]}
      onPress={() => {
        setEventId(item.event_id);
        navigation.navigate('Feed', { eventId: item.event_id });
      }}
      activeOpacity={0.8}
    >
      {/* Circular Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.circularIcon}>
          <Text style={styles.iconText}>
            {String(item.event_name).charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      
      {/* Event Details */}
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>
          {String(item.event_name)}
        </Text>
        <Text style={[styles.eventOrganisation, { color: currentTheme.text }]}>
          {String(item.organisation)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="calendar-outline" size={64} color="#4A148C" />
      </View>
      <Text style={[styles.emptyTitle, { color: currentTheme.text }]}>
        No Events Available
      </Text>
      <Text style={[styles.emptySubtitle, { color: currentTheme.text }]}>
        You don't have any upcoming events at the moment.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.background}
      />

      {/* Header Section - Matching Screenshot */}
      <View style={[styles.header, { backgroundColor: currentTheme.background }]}>
        <Text style={styles.appName}>Convene</Text>
        <Text style={[styles.subtitle, { color: currentTheme.text }]}>
          Select your conference
        </Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.8,
    color: '#4A148C',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.8,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#4A148C',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 16,
  },
  circularIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A148C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A148C',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 26,
    color: '#4A148C',
  },
  eventOrganisation: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 22,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(74, 20, 140, 0.1)',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.7,
  },
});

export default EventList;