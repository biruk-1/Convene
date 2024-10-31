import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import PropTypes from 'prop-types';

const EventDetails = ({ route }) => {
  const { eventId } = route.params;
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`https://zelesegna.com/convene/app/get_event_details.php?eventId=${eventId}`);
        const eventData = await response.json();

        if (eventData.status === 'success') {
          setEventDetails(eventData.result);
        } else {
          Alert.alert('Failed to load event details');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        Alert.alert('Error loading event details', 'Please check your internet connection.');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (!eventDetails) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{eventDetails.event_name}</Text>
      <Text>Organization: {eventDetails.organization}</Text>
      <Text>Location: {eventDetails.location}</Text>
      <Text>Date: {eventDetails.date}</Text>
      <Text>Description: {eventDetails.description}</Text>
    </View>
  );
};

EventDetails.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      eventId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default EventDetails;
