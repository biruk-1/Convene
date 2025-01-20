import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, FlatList } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';
import dayjs from 'dayjs';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

const { width } = Dimensions.get('window');

const CalendarView = () => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [meetings, setMeetings] = useState([]);
  const [eventDates, setEventDates] = useState([]);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const translateX = useRef(new Animated.Value(0)).current;
  const currentPage = useRef(0); // Tracks the page number

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch('https://zelesegna.com/convene/app/get_schedule.php?event=1');
        const data = await response.json();
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
        const uniqueDates = Array.from(new Set(formattedMeetings.map(meeting => meeting.date)))
          .map(dateStr => dayjs(dateStr).toDate());
        setEventDates(uniqueDates);
      } catch (error) {
        console.error('Error fetching the data:', error);
      }
    };
    fetchMeetings();
  }, []);

  const getMeetingStatus = (startTime, endTime) => {
    const now = dayjs();
    if (now.isAfter(endTime)) return 'past';
    if (now.isBetween(startTime, endTime)) return 'ongoing';
    return 'future';
  };

  const filteredMeetings = meetings.filter(meeting =>
    dayjs(meeting.date).isSame(selectedDate, 'day')
  );

  const renderMeeting = ({ item: meeting }) => {
    const status = getMeetingStatus(meeting.startTime, meeting.endTime);
    const isOngoing = status === 'ongoing';
    const isPast = status === 'past';

    return (
      <View style={[styles.meetingContainer, { backgroundColor: currentTheme.secondary }]}>
        <View style={styles.leftPart}>
          <Text style={[
            styles.timeText,
            isPast && styles.pastText,
            isOngoing && styles.boldText,
            { color: currentTheme.text }
          ]}>
            {meeting.time}
          </Text>
          <TouchableOpacity disabled={!isOngoing}>
            <View style={[
              styles.circle,
              isOngoing ? styles.activeCircle : isPast ? styles.pastCircle : styles.futureCircle
            ]} />
          </TouchableOpacity>
        </View>
        <View style={[styles.divider, { backgroundColor: currentTheme.text }]} />
        <View style={styles.rightPart}>
          <Text style={[
            styles.meetingTitle,
            isPast && styles.pastText,
            isOngoing && styles.boldText,
            { color: currentTheme.text }
          ]}>
            {meeting.title}
          </Text>
          <MeetingDetail icon="location-outline" text={meeting.room} isPast={isPast} isOngoing={isOngoing} />
          <MeetingDetail icon="calendar-outline" text={meeting.date} isPast={isPast} isOngoing={isOngoing} />
          <MeetingDetail
            icon="time-outline"
            text={`${meeting.startTime.format('HH:mm')} - ${meeting.endTime.format('HH:mm')}`}
            isPast={isPast}
            isOngoing={isOngoing}
          />
        </View>
      </View>
    );
  };

  const handleGestureEnd = ({ nativeEvent }) => {
    if (nativeEvent.translationX < -50 && (currentPage.current + 1) * 6 < eventDates.length) {
      currentPage.current += 1;
    } else if (nativeEvent.translationX > 50 && currentPage.current > 0) {
      currentPage.current -= 1;
    }
    setSelectedDate(dayjs(eventDates[currentPage.current * 6]));
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
  };

  const renderDate = ({ item }) => {
    const isSelected = dayjs(item).isSame(selectedDate, 'day');
    return (
      <TouchableOpacity onPress={() => setSelectedDate(dayjs(item))} style={styles.dateItem}>
        <View style={[styles.dateCircle, isSelected && styles.selectedDateCircle]}>
          <Text style={[styles.dayText, { color: currentTheme.text }]}>{dayjs(item).format('ddd')}</Text>
          <Text style={[styles.dateText, { color: currentTheme.text }]}>{dayjs(item).format('DD')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const MeetingDetail = ({ icon, text, isPast, isOngoing }) => (
    <View style={styles.meetingDetail}>
      <Icon name={icon} size={16} color={currentTheme.text} />
      <Text style={[
        styles.detailText,
        isPast && styles.pastText,
        isOngoing && styles.boldText,
        { color: currentTheme.text }
      ]}>
        {text}
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <Text style={styles.activityTimeText}>Schedule</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.activityText}>Activity Date</Text>
          <PanGestureHandler
            onGestureEvent={Animated.event([{ nativeEvent: { translationX: translateX } }], { useNativeDriver: true })}
            onEnded={handleGestureEnd}
          >
            <Animated.View style={{ transform: [{ translateX }] }}>
              <FlatList
                data={eventDates.slice(currentPage.current * 6, (currentPage.current + 1) * 6)}
                renderItem={renderDate}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </Animated.View>
          </PanGestureHandler>
        </View>
        <FlatList
          data={filteredMeetings}
          renderItem={renderMeeting}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.meetingListContainer}
          ListEmptyComponent={() => (
            <Text style={[styles.noMeetingsText, { color: currentTheme.text }]}>
              No meetings for the selected date.
            </Text>
          )}
        />
        <Footer />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  dateItem: { width: width / 6, alignItems: 'center' },
  dateCircle: { padding: 10, borderRadius: 50, alignItems: 'center',backgroundColor:'#adadad', borderRadius: width - 0.5,paddingTop:10,paddingBottom:20},
  dateContainer:{border: '1 solid #c8c6c6', padding: 20,margin:10, borderRadius:20, paddingBottom: 20,backgroundColor: '#605d5d'},
  selectedDateCircle: {  backgroundColor:'#faf6f8', borderRadius: width - 0.5,paddingBottom:15,paddingTop:15,},
  dayText: { fontSize: 14, fontWeight: 'bold' },
  dateText: { fontSize: 18 },
  activityTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#656464',
    textAlign: 'start',
    marginLeft: 20,
    paddingTop: '2%',
    letterSpacing: 1.5,
    // textTransform: 'uppercase',
  },
  activityText: { fontSize: 16, fontWeight: 'bold',color: '#a7a3a3', paddingLeft:10,paddingBottom:10,marginBottom:10},
  meetingListContainer: { flex: 1, paddingHorizontal: 15 },
  meetingContainer: { flexDirection: 'row', borderRadius: 10, marginBottom: 15, padding: 15 },
  leftPart: { justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  circle: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#ccc' },
  activeCircle: { backgroundColor: '#faf6f8', borderRadius:8 },
  pastCircle: { backgroundColor: '#999' },
  futureCircle: { backgroundColor: '#00aa77' },
  divider: { width: 1, marginVertical: 0, marginLeft:'22%',marginRight:'4%'  },
  rightPart: { flex: 1 },
  meetingTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  boldText: { fontWeight: 'bold' },
  pastText: { textDecorationLine: 'line-through', color: '#888' },
  meetingDetail: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  detailText: { marginLeft: 8 },
  noMeetingsText: { textAlign: 'center', marginTop: 20 },
});

export default CalendarView;
