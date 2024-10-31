import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';
import dayjs from 'dayjs';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

const { width } = Dimensions.get('window');

const CalendarView = () => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [meetings, setMeetings] = useState([]);
  const [eventDates, setEventDates] = useState([]);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    fetch('https://zelesegna.com/convene/app/get_schedule.php?event=1')
      .then((response) => response.json())
      .then((data) => {
        const formattedMeetings = data.result.map(meeting => {
          const eventDate = dayjs(meeting.event_date);
          const startTime = dayjs(`${meeting.event_date}T${meeting.start_time}`);
          const endTime = dayjs(`${meeting.event_date}T${meeting.end_time}`);

          return {
            id: parseInt(meeting.schedile_id),
            time: startTime.format('HH:mm'),
            title: meeting.topic,
            room: meeting.location,
            date: eventDate.format('YYYY-MM-DD'),
            startTime,
            endTime,
          };
        });

        setMeetings(formattedMeetings);

        const uniqueDates = Array.from(new Set(
          formattedMeetings.map(meeting => meeting.date)
            .filter(dateStr => dateStr !== 'Date unavailable')
        )).map(dateStr => dayjs(dateStr).toDate());

        setEventDates(uniqueDates);
      })
      .catch((error) => console.error('Error fetching the data:', error));
  }, []);

  const getMeetingStatus = (startTime, endTime) => {
    const now = dayjs();
    if (now.isAfter(endTime)) return 'past';
    if (now.isBetween(startTime, endTime)) return 'ongoing';
    return 'future';
  };

  const filteredMeetings = meetings.filter(
    meeting => dayjs(meeting.date).isSame(selectedDate, 'day')
  );

  const renderMeeting = ({ item: meeting }) => {
    const status = getMeetingStatus(meeting.startTime, meeting.endTime);
    const isOngoing = status === 'ongoing';
    const isPast = status === 'past';

    return (
      <View style={[styles.meetingContainer, { backgroundColor: currentTheme.secondary }]}>
        <View style={styles.leftPart}>
          <Text style={[styles.timeText, isPast && styles.pastText, isOngoing && styles.boldText, { color: currentTheme.text }]}>
            {meeting.time}
          </Text>
          <TouchableOpacity disabled={!isOngoing} onPress={() => console.log('Circle clicked!')}>
            <View style={[styles.circle, isOngoing ? styles.activeCircle : isPast ? styles.pastCircle : styles.futureCircle]} />
          </TouchableOpacity>
        </View>
        <View style={[styles.divider, { backgroundColor: currentTheme.text }]} />
        <View style={styles.rightPart}>
          <Text style={[styles.meetingTitle, isPast && styles.pastText, isOngoing && styles.boldText, { color: currentTheme.text }]}>
            {meeting.title}
          </Text>
          <MeetingDetail icon="location-outline" text={meeting.room} isPast={isPast} isOngoing={isOngoing} />
          <MeetingDetail icon="calendar-outline" text={meeting.date} isPast={isPast} isOngoing={isOngoing} />
          <MeetingDetail
            icon="time-outline"
            text={`${meeting.startTime.format('HH:mm')} - ${meeting.endTime.format('HH:mm')}`}
            isPast={isPast} isOngoing={isOngoing}
          />
        </View>
      </View>
    );
  };

  const renderDate = ({ item: date }) => (
    <TouchableOpacity onPress={() => handleDateSelect(date)}>
      <View style={[
        styles.dateBox,
        selectedDate.isSame(date, 'day') ? styles.selectedDateBox : null,
        { backgroundColor: selectedDate.isSame(date, 'day') ? currentTheme.primary : currentTheme.secondary }
      ]}>
        <Text style={[
          styles.dayText,
          selectedDate.isSame(date, 'day') ? styles.selectedDayText : null,
          { color: selectedDate.isSame(date, 'day') ? currentTheme.text : currentTheme.text }
        ]}>
          {date.toLocaleString('en-US', { weekday: 'short' })}
        </Text>
        <Text style={[
          selectedDate.isSame(date, 'day') ? styles.selectedDate : styles.dateText,
          { color: selectedDate.isSame(date, 'day') ? currentTheme.text : currentTheme.text }
        ]}>
          {date.getDate()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const MeetingDetail = ({ icon, text, isPast, isOngoing }) => (
    <View style={styles.meetingDetail}>
      <Icon name={icon} size={16} color={currentTheme.text} />
      <Text style={[styles.detailText, isPast && styles.pastText, isOngoing && styles.boldText, { color: currentTheme.text }]}>{text}</Text>
    </View>
  );

  const handleDateSelect = (date) => {
    setSelectedDate(dayjs(date));
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <FlatList
        horizontal
        data={eventDates}
        renderItem={renderDate}
        keyExtractor={(date, index) => `${dayjs(date).valueOf()}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScrollContainer}
        style={styles.horizontalScrollView}
      />

      <FlatList
        data={filteredMeetings}
        renderItem={renderMeeting}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.meetingListContainer}
        ListEmptyComponent={() => (
          <Text style={[styles.noMeetingsText, { color: currentTheme.text }]}>No meetings for the selected date.</Text>
        )}
      />

      <Footer style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  horizontalScrollView: {
    flexGrow: 0,
    height: 'auto',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  dateScrollContainer: {
    paddingVertical: 10,
  },
  dateBox: {
    width: 80,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  selectedDateBox: {
    borderRadius: 30,
    paddingVertical: 10,
    width: 50,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
  },
  dateText: {
    fontSize: 18,
  },
  selectedDate: {
    fontSize: 18,
  },
  meetingListContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  meetingContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  leftPart: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  activeCircle: {
    backgroundColor: '#cc0077',
  },
  pastCircle: {
    backgroundColor: '#ddd',
  },
  futureCircle: {
    backgroundColor: '#0db07b',
  },
  timeText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#cc0077',
  },
  pastText: {
    color: '#aaa',
  },
  divider: {
    width: 3,
    marginHorizontal: 10,
    marginLeft: '15%',
    marginRight: '5%',
  },
  rightPart: {
    flex: 1,
    justifyContent: 'center',
  },
  meetingTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  meetingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  noMeetingsText: {
    textAlign: 'center',
    fontSize: 16,
  },
  footer: {
    marginTop: 10,
  },
});

export default CalendarView;