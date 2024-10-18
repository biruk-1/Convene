import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../Components/Footer';

export default function AskQuestion({ route }) {
  const navigation = useNavigation();
  const { userName } = route.params; // Access userName passed from QuestionsPage

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f0f0f0' }}>
      {/* Input box for question */}
      <TextInput
        placeholder="State your question here..."
        style={{
          height: '50%',
          backgroundColor: '#eaeaea',
          padding: 10,
          fontSize: 16,
          marginBottom: 20,
        }}
        multiline
      />

      {/* Ask options */}
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Icon name="person-circle-outline" size={25} color="#000" />
        <Text style={{ marginLeft: 10 }}>Ask as {userName}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="person-outline" size={25} color="#000" />
        <Text style={{ marginLeft: 10 }}>Ask Anonymously</Text>
      </TouchableOpacity>

      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 30 }}>
        <Text style={{ color: '#fd61e3', textAlign: 'center' }}>Cancel</Text>
      </TouchableOpacity>
      
    </View>

  );
}
