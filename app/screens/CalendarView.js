import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';
import dayjs from 'dayjs'; // Import Day.js

const { width } = Dimensions.get('window');

const CalendarView = () => {
  const today = dayjs(); // Use Day.js to get today's date
  const [selectedDate, setSelectedDate] = useState(today);
  const [meetings, setMeetings] = useState([]);
  const [eventDates, setEventDates] = useState([]);

  useEffect(() => {
    fetch('https://zelesegna.com/convene/app/get_schedule.php?event=1')
      .then((response) => response.json())
      .then((data) => {
        const formattedMeetings = data.result.map(meeting => {
          const eventDate = dayjs(meeting.event_date); // Use Day.js
          const startTime = dayjs(`${meeting.event_date}T${meeting.start_time}`);
          const endTime = dayjs(`${meeting.event_date}T${meeting.end_time}`);

          return {
            id: parseInt(meeting.schedile_id),
            time: startTime.format('HH:mm'), // Format using Day.js
            title: meeting.topic,
            room: meeting.location,
            date: eventDate.format('YYYY-MM-DD'), // Format date
            startTime,
            endTime,
          };
        });

        setMeetings(formattedMeetings);

        const uniqueDates = Array.from(new Set(
          formattedMeetings.map(meeting => meeting.date)
            .filter(dateStr => dateStr !== 'Date unavailable')
        )).map(dateStr => dayjs(dateStr).toDate()); // Convert Day.js date back to JS date

        setEventDates(uniqueDates);
      })
      .catch((error) => console.error('Error fetching the data:', error));
  }, []);

  const getMeetingStatus = (startTime, endTime) => {
    const now = dayjs(); // Use Day.js for the current time
    if (now.isAfter(endTime)) return 'past';
    if (now.isBetween(startTime, endTime)) return 'ongoing';
    return 'future';
  };

  const filteredMeetings = meetings.filter(
    meeting => dayjs(meeting.date).isSame(selectedDate, 'day') // Check if the date is the same
  );

  const renderMeeting = ({ item: meeting }) => {
    const status = getMeetingStatus(meeting.startTime, meeting.endTime);
    const isOngoing = status === 'ongoing';
    const isPast = status === 'past';

    return (
      <View style={styles.meetingContainer}>
        <View style={styles.leftPart}>
          <Text style={[styles.timeText, isPast && styles.pastText, isOngoing && styles.boldText]}>
            {meeting.time}
          </Text>
          <TouchableOpacity disabled={!isOngoing} onPress={() => console.log('Circle clicked!')}>
            <View style={[styles.circle, isOngoing ? styles.activeCircle : isPast ? styles.pastCircle : styles.futureCircle]} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.rightPart}>
          <Text style={[styles.meetingTitle, isPast && styles.pastText, isOngoing && styles.boldText]}>
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
        selectedDate.isSame(date, 'day') ? styles.selectedDateBox : null
      ]}>
        <Text style={[
          styles.dayText,
          selectedDate.isSame(date, 'day') ? styles.selectedDayText : null
        ]}>
          {date.toLocaleString('en-US', { weekday: 'short' })}
        </Text>
        <Text style={[
          selectedDate.isSame(date, 'day') ? styles.selectedDate : styles.dateText
        ]}>
          {date.getDate()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const MeetingDetail = ({ icon, text, isPast, isOngoing }) => (
    <View style={styles.meetingDetail}>
      <Icon name={icon} size={16} color="#000" />
      <Text style={[styles.detailText, isPast && styles.pastText, isOngoing && styles.boldText]}>{text}</Text>
    </View>
  );

  const handleDateSelect = (date) => {
    setSelectedDate(dayjs(date)); // Set selected date using Day.js
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={eventDates}
        renderItem={renderDate}
        keyExtractor={(date, index) => `${dayjs(date).valueOf()}-${index}`} // Use Day.js for unique key
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
          <Text style={styles.noMeetingsText}>No meetings for the selected date.</Text>
        )}
      />

      <Footer style={styles.footer} />
    </View>
  );
};

// ... styles remain exactly the same ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingBottom: 20,
  },
  horizontalScrollView: {
    flexGrow: 0,
    height: 'auto',
    backgroundColor: '#e0e0e0',
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
    backgroundColor: '#cc0077',
    borderRadius: 30,
    paddingVertical: 10,
    width: 50,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7e7e7e',
  },
  selectedDayText: {
    color: '#fff',
  },
  dateText: {
    fontSize: 18,
    color: '#333',
  },
  selectedDate: {
    fontSize: 18,
    color: '#fff',
  },
  meetingListContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  meetingContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    backgroundColor: '#ddd',
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
    color: '#333',
  },
  meetingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  noMeetingsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  footer: {
    marginTop: 10,
  },
});

export default CalendarView;



// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Footer from '../Components/Footer';
// import calendarData from '../Data/Calander.json'; // Adjust the path as necessary

// const { width } = Dimensions.get('window');

// const CalendarView = () => {
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState(today);
//   const [meetings, setMeetings] = useState([]);
//   const [eventDates, setEventDates] = useState([]);

//   useEffect(() => {
//     // Instead of fetching from an API, use the imported JSON data
//     const formattedMeetings = calendarData.result.map(meeting => ({
//       id: parseInt(meeting.schedule_id),
//       time: new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       title: meeting.topic,
//       room: meeting.location,
//       date: new Date(meeting.event_date).toLocaleDateString(),
//       startTime: new Date(`${meeting.event_date}T${meeting.start_time}`),
//       endTime: new Date(`${meeting.event_date}T${meeting.end_time}`),
//     }));

//     setMeetings(formattedMeetings);

//     const uniqueDates = Array.from(
//       new Set(formattedMeetings.map(meeting => new Date(meeting.date).toLocaleDateString()))
//     ).map(date => new Date(date));

//     setEventDates(uniqueDates);
//   }, []);

//   const getMeetingStatus = (startTime, endTime) => {
//     const now = new Date();
//     if (now > endTime) return 'past';
//     if (now >= startTime && now <= endTime) return 'ongoing';
//     return 'future';
//   };

//   const filteredMeetings = meetings.filter(
//     meeting => new Date(meeting.date).toLocaleDateString() === selectedDate.toLocaleDateString()
//   );

//   const renderMeeting = (meeting) => {
//     const status = getMeetingStatus(meeting.startTime, meeting.endTime);
//     const isOngoing = status === 'ongoing';
//     const isPast = status === 'past';

//     return (
//       <View key={meeting.id} style={styles.meetingContainer}>
//         <View style={styles.leftPart}>
//           <Text style={[styles.timeText, isPast && styles.pastText, isOngoing && styles.boldText]}>
//             {meeting.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//           <TouchableOpacity disabled={!isOngoing} onPress={() => console.log('Circle clicked!')}>
//             <View style={[styles.circle, isOngoing ? styles.activeCircle : isPast ? styles.pastCircle : styles.futureCircle]} />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.divider} />
//         <View style={styles.rightPart}>
//           <Text style={[styles.meetingTitle, isPast && styles.pastText, isOngoing && styles.boldText]}>
//             {meeting.title}
//           </Text>
//           <MeetingDetail icon="location-outline" text={meeting.room} isPast={isPast} isOngoing={isOngoing} />
//           <MeetingDetail icon="calendar-outline" text={meeting.date} isPast={isPast} isOngoing={isOngoing} />
//           <MeetingDetail
//             icon="time-outline"
//             text={`${meeting.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${meeting.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
//             isPast={isPast} isOngoing={isOngoing}
//           />
//         </View>
//       </View>
//     );
//   };

//   const MeetingDetail = ({ icon, text, isPast, isOngoing }) => (
//     <View style={styles.meetingDetail}>
//       <Icon name={icon} size={16} color="#000" />
//       <Text style={[styles.detailText, isPast && styles.pastText, isOngoing && styles.boldText]}>{text}</Text>
//     </View>
//   );

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.dateScrollContainer}
//         style={styles.horizontalScrollView}
//       >
//         {eventDates.map((date, idx) => (
//           <TouchableOpacity key={idx} onPress={() => handleDateSelect(date)}>
//             <View style={[
//               styles.dateBox,
//               selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth() ? styles.selectedDateBox : null
//             ]}>
//               <Text style={[
//                 styles.dayText,
//                 selectedDate.getDate() === date.getDate() ? styles.selectedDayText : null
//               ]}>
//                 {date.toLocaleString('en-US', { weekday: 'short' })}
//               </Text>
//               <Text style={[
//                 selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth() ? styles.selectedDate : styles.dateText
//               ]}>
//                 {date.getDate()}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <ScrollView showsVerticalScrollIndicator={false} style={styles.meetingListContainer}>
//         {filteredMeetings.length > 0 ? (
//           filteredMeetings.map(renderMeeting)
//         ) : (
//           <Text style={styles.noMeetingsText}>No meetings for the selected date.</Text>
//         )}
//       </ScrollView>

//       <Footer style={styles.footer} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f3f3f3',
//     paddingBottom: 20,
//   },
//   horizontalScrollView: {
//     flexGrow: 0,
//     height: 'auto',
//     backgroundColor: '#e0e0e0',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     marginHorizontal: 10,
//   },
//   dateScrollContainer: {
//     paddingVertical: 10,
//   },
//   dateBox: {
//     width: 80,
//     alignItems: 'center',
//     paddingHorizontal: 5,
//   },
//   selectedDateBox: {
//     backgroundColor: '#cc0077',
//     borderRadius: 30,
//     paddingVertical: 10,
//     width: 50,
//   },
//   dayText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#7e7e7e',
//   },
//   selectedDayText: {
//     color: '#fff',
//   },
//   dateText: {
//     fontSize: 18,
//     color: '#333',
//   },
//   selectedDate: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   meetingListContainer: {
//     flex: 1,
//     paddingHorizontal: 15,
//   },
//   meetingContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 15,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   leftPart: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   circle: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//   },
//   activeCircle: {
//     backgroundColor: '#cc0077',
//   },
//   pastCircle: {
//     backgroundColor: '#ddd',
//   },
//   futureCircle: {
//     backgroundColor: '#0db07b',
//   },
//   timeText: {
//     fontSize: 16,
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   boldText: {
//     fontWeight: 'bold',
//     color: '#cc0077',
//   },
//   pastText: {
//     color: '#aaa',
//   },
//   divider: {
//     width: 3,
//     backgroundColor: '#ddd',
//     marginHorizontal: 10,
//     marginLeft: '15%',
//     marginRight: '5%',
//     color: 'black',
//   },
//   rightPart: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   meetingTitle: {
//     fontSize: 16,
//     marginBottom: 10,
//     color: '#333',
//   },
//   meetingDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   detailText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#333',
//   },
//   noMeetingsText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginVertical: 20,
//     color: '#999',
//   },
//   footer: {
//     marginTop: 20,
//   },
// });

// export default CalendarView;
