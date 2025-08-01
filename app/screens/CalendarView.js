import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Animated, 
  FlatList,
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../Components/Footer';
import dayjs from 'dayjs';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

const { width, height } = Dimensions.get('window');

const CalendarView = () => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [meetings, setMeetings] = useState([]);
  const [eventDates, setEventDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const translateX = useRef(new Animated.Value(0)).current;
  const currentPage = useRef(0);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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

  const renderMeeting = ({ item: meeting, index }) => {
    const status = getMeetingStatus(meeting.startTime, meeting.endTime);
    const isOngoing = status === 'ongoing';
    const isPast = status === 'past';
    const isFuture = status === 'future';
    const isLast = index === filteredMeetings.length - 1;

    return (
      <View style={styles.meetingContainer}>
        {/* Time Column - Left Side */}
        <View style={styles.timeColumn}>
          <Text style={[
            styles.meetingTime,
            { 
              color: isPast ? '#999' : isOngoing ? '#4A148C' : currentTheme.text,
              textDecorationLine: isPast ? 'line-through' : 'none',
              opacity: isPast ? 0.6 : 1
            }
          ]}>
            {meeting.time}
          </Text>
        </View>

        {/* Timeline Column - Center */}
        <View style={styles.timelineColumn}>
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine}>
              {!isLast && <View style={[styles.verticalLine, { backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0' }]} />}
            </View>
            <View style={[
              styles.timelineCircle,
              { 
                backgroundColor: isOngoing ? '#4A148C' : isPast ? '#999' : '#666',
                borderWidth: isOngoing ? 2 : 0,
                borderColor: isOngoing ? '#fff' : 'transparent'
              }
            ]}>
              {isOngoing && <Ionicons name="checkmark" size={8} color="#fff" />}
            </View>
          </View>
        </View>

        {/* Event Details Column - Right Side */}
        <View style={styles.eventDetailsColumn}>
          <Text style={[
            styles.meetingTitle,
            { 
              color: isPast ? '#999' : isOngoing ? '#4A148C' : currentTheme.text,
              textDecorationLine: isPast ? 'line-through' : 'none',
              opacity: isPast ? 0.6 : 1
            }
          ]}>
            {meeting.title}
          </Text>
          
          <View style={styles.meetingDetails}>
            <MeetingDetail icon="location-outline" text={meeting.room} status={status} />
            <MeetingDetail icon="calendar-outline" text={meeting.date} status={status} />
            <MeetingDetail
              icon="time-outline"
              text={`${meeting.startTime.format('HH:mm')} - ${meeting.endTime.format('HH:mm')}`}
              status={status}
            />
          </View>

          {/* Status Indicator */}
          {isOngoing && (
            <View style={styles.statusIndicator}>
              <Text style={styles.statusText}>Happening Now</Text>
            </View>
          )}
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
        <View style={[
          styles.dateCircle, 
          isSelected && styles.selectedDateCircle,
          { backgroundColor: isSelected ? '#4A148C' : theme === 'dark' ? '#333' : '#f0f0f0' }
        ]}>
          <Text style={[
            styles.dayText, 
            { color: isSelected ? '#fff' : currentTheme.text }
          ]}>
            {dayjs(item).format('ddd')}
          </Text>
          <Text style={[
            styles.dateText, 
            { color: isSelected ? '#fff' : currentTheme.text }
          ]}>
            {dayjs(item).format('DD')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const MeetingDetail = ({ icon, text, status }) => {
    const isPast = status === 'past';
    const isOngoing = status === 'ongoing';
    const isFuture = status === 'future';
    
    return (
      <View style={styles.meetingDetail}>
        <Ionicons 
          name={icon} 
          size={14} 
          color={isPast ? '#999' : isOngoing ? '#4A148C' : '#666'} 
        />
        <Text style={[
          styles.detailText,
          { 
            color: isPast ? '#999' : isOngoing ? '#4A148C' : '#666',
            textDecorationLine: isPast ? 'line-through' : 'none',
            opacity: isPast ? 0.6 : 1
          }
        ]}>
          {text}
        </Text>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.catEmoji}>🐱</Text>
      <Text style={[styles.emptyText, { color: currentTheme.text }]}>
        No meetings for the selected date
      </Text>
      <Text style={[styles.emptySubtext, { color: currentTheme.text }]}>
        Take a break and enjoy your day!
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <StatusBar 
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor={currentTheme.background} 
        />
        
        {/* Main Header - Convene Calendar */}
        <View style={[styles.header, { backgroundColor: currentTheme.background }]}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerLeft}>
              <Text style={[styles.appName, { color: currentTheme.text }]}>Convene</Text>
              <Text style={[styles.calendarTitle, { color: currentTheme.text }]}>Calendar</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <Ionicons name="notifications-outline" size={22} color={currentTheme.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <Ionicons name="download-outline" size={22} color={currentTheme.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Calendar Content */}
        <View style={styles.contentContainer}>
          <View style={[styles.dateContainer, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa' }]}>
            <Text style={[styles.activityText, { color: currentTheme.text }]}>Activity Date</Text>
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
            contentContainerStyle={styles.meetingListContent}
            ListEmptyComponent={EmptyState}
          />
        </View>
        
        <Footer />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: Platform.OS === 'ios' ? 4 : 8,
  },
  headerLeft: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  calendarTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 6,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  dateItem: { 
    width: width / 6, 
    alignItems: 'center' 
  },
  dateCircle: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    minWidth: 60,
    minHeight: 60,
    justifyContent: 'center',
  },
  selectedDateCircle: { 
    backgroundColor: '#4A148C',
  },
  dayText: { 
    fontSize: 12, 
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: { 
    fontSize: 16,
    fontWeight: '700',
  },
  activityText: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 16,
  },
  meetingListContainer: { 
    flex: 1,
  },
  meetingListContent: {
    paddingBottom: 20,
  },
  meetingContainer: { 
    flexDirection: 'row',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  timeColumn: {
    width: 80,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  timelineColumn: {
    width: 40,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  timelineContainer: {
    alignItems: 'center',
    position: 'relative',
    width: 20,
  },
  timelineLine: {
    position: 'absolute',
    top: 20,
    bottom: -24,
    left: 9,
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    flex: 1,
  },
  timelineCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDetailsColumn: {
    flex: 1,
    paddingTop: 8,
  },
  meetingTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  meetingDetails: {
    gap: 4,
  },
  meetingDetail: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 2,
  },
  detailText: { 
    marginLeft: 8,
    fontSize: 14,
  },
  statusIndicator: {
    backgroundColor: '#4A148C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  catEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default CalendarView;
