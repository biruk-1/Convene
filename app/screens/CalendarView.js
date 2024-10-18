import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';

const { width } = Dimensions.get('window');

const CalendarView = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(0); // State to track the current week being displayed

  // Generate 14 days of dates starting from today
  const generateTwoWeeks = (weekOffset) => {
    const dates = [];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + weekOffset * 14);

    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const meetings = [
    {
      id: 1,
      time: '8:00 AM',
      title: 'Team Meeting',
      room: 'Meeting Room 8',
      date: today.toLocaleDateString(),
      startTime: new Date(today.setHours(8, 0, 0)),
      endTime: new Date(today.setHours(9, 0, 0)),
    },
    {
      id: 2,
      time: '12:00 PM',
      title: 'Project Update',
      room: 'Meeting Room 2',
      date: today.toLocaleDateString(),
      startTime: new Date(today.setHours(12, 0, 0)),
      endTime: new Date(today.setHours(13, 0, 0)),
    },
    {
      id: 3,
      time: '4:00 PM',
      title: 'Client Call',
      room: 'Meeting Room 5',
      date: today.toLocaleDateString(),
      startTime: new Date(today.setHours(16, 0, 0)),
      endTime: new Date(today.setHours(17, 0, 0)),
    },
    {
      id: 4,
      time: '6:00 PM',
      title: 'Evening Review',
      room: 'Meeting Room 1',
      date: today.toLocaleDateString(),
      startTime: new Date(today.setHours(18, 0, 0)),
      endTime: new Date(today.setHours(19, 0, 0)),
    },
    {
      id: 5,
      time: '9:00 PM',
      title: 'Final Call',
      room: 'Meeting Room 7',
      date: today.toLocaleDateString(),
      startTime: new Date(today.setHours(21, 0, 0)),
      endTime: new Date(today.setHours(22, 0, 0)),
    },
  ];

  const getMeetingStatus = (startTime, endTime) => {
    const now = new Date();
    if (now > endTime) return 'past';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'future';
  };

  const renderMeeting = (meeting) => {
    const status = getMeetingStatus(meeting.startTime, meeting.endTime);
    const isOngoing = status === 'ongoing';
    const isPast = status === 'past';

    return (
      <View key={meeting.id} style={[styles.meetingContainer, isOngoing && styles.ongoingMeeting, isPast && styles.pastMeeting]}>
        <View style={styles.leftPart}>
          <Text style={[styles.timeText, isPast && styles.pastText]}>{meeting.time}</Text>
          <View style={[styles.circle, isOngoing ? styles.activeCircle : isPast ? styles.pastCircle : styles.futureCircle]} />
        </View>
        <View style={styles.divider} />
        <View style={styles.rightPart}>
          <Text style={styles.meetingTitle}>{meeting.title}</Text>
          <View style={styles.meetingDetail}>
            <Icon name="location-outline" size={16} color="#000" />
            <Text style={styles.detailText}>{meeting.room}</Text>
          </View>
          <View style={styles.meetingDetail}>
            <Icon name="calendar-outline" size={16} color="#000" />
            <Text style={styles.detailText}>{meeting.date}</Text>
          </View>
          <View style={styles.meetingDetail}>
            <Icon name="time-outline" size={16} color="#000" />
            <Text style={styles.detailText}>
              {`${meeting.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${meeting.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </Text>
          </View>
        </View>
        
      </View>
    );
  };

  // Handle swipe to change the current week
  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentWeek(index);
  };

  return (
    <View style={styles.container}>
      {/* Date Calendar Section */}
      <ScrollView
        horizontal
        pagingEnabled
        onMomentumScrollEnd={handleScrollEnd}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScrollContainer}
        style={styles.horizontalScrollView}
      >
        {[...Array(52).keys()].map((_, index) => (
          <View style={styles.dateContainer} key={index}>
            {/* Display dates in 2 rows */}
            <View style={styles.twoWeekContainer}>
              {generateTwoWeeks(index).map((date, idx) => (
                <View key={idx} style={styles.dateBox}>
                  {/* Display day of the week only in the first row */}
                  {idx < 7 && <Text style={styles.dayText}>{date.toLocaleString('en-US', { weekday: 'short' })}</Text>}
                  <Text
                    style={
                      today.getDate() === date.getDate() && today.getMonth() === date.getMonth()
                        ? styles.todayDate
                        : styles.dateText
                    }
                  >
                    {date.getDate()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Scrollable Meeting List Section */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.meetingListContainer}>
        {meetings.map((meeting) => renderMeeting(meeting))}
      </ScrollView>

      <Footer style={styles.footer} />
    </View>

     
    
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  horizontalScrollView: {
    flexGrow: 0, // Prevents it from growing more than its content
    height: 'auto', // Adjusts height based on content
  },
  dateScrollContainer: {
    paddingVertical: 10,
    backgroundColor: '#db1d1d',
  },
  dateContainer: {
    width: width,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
  },
  twoWeekContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },


  dateBox: {
    width: '14%', // Adjust to fit 7 dates in one row
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 18,
    color: '#333',
  },
  todayDate: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#fd61e3',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  meetingListContainer: {
    flex: 0.7, // Set height ratio for vertical scroll view
  },
  meetingContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  ongoingMeeting: {
    backgroundColor: '#d7ffe0',
  },
  pastMeeting: {
    backgroundColor: '#f5f5f5',
  },
  leftPart: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  activeCircle: {
    backgroundColor: '#34a853',
  },
  pastCircle: {
    backgroundColor: 'gray',
  },
  futureCircle: {
    backgroundColor: '#ccc',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  pastText: {
    color: 'gray',
  },
  divider: {
    width: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  rightPart: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  meetingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailText: {
    marginLeft: 5,
    color: '#555',
  },
});

export default CalendarView;
