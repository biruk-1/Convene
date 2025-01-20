// app/screens/EventList.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, StyleSheet } from 'react-native';
import { useEventId } from '../context/EventIdContext';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

const EventList = ({ navigation, route }) => {
  const { participantId } = route.params;
  const [events, setEvents] = useState([]);
  const { setEventId } = useEventId();
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const fetchEvents = async () => {
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
      }
    };

    fetchEvents();
  }, [participantId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.eventItem, { backgroundColor: currentTheme.secondary }]}
      onPress={() => {
        setEventId(item.event_id);
        navigation.navigate('Feed', { eventId: item.event_id });
      }}
    >
      <Text style={[styles.eventTitle, { color: currentTheme.primary }]}>{String(item.event_name)}</Text>
      <Text style={[styles.eventOrganisation, { color: currentTheme.text }]}>{String(item.organisation)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.event_id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventItem: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  eventOrganisation: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default EventList;