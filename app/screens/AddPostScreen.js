import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Image, VirtualizedList, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

export default function AddPostScreen({ navigation }) {
  const [galleryImages, setGalleryImages] = useState([]);
  const [postText, setPostText] = useState('');

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Function to open the camera and take a picture
  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission required", "Camera permission is required to take pictures.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true });
    if (!result.cancelled) {
      setGalleryImages([result.uri, ...galleryImages]);
    } else {
      Alert.alert("Cancelled", "Camera capture was cancelled.");
    }
  };

  // Function to open the image picker and select images from the gallery
  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission required", "Gallery permission is required to select images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      Alert.alert("Cancelled", "Image selection was cancelled.");
      return;
    }

    if (result.assets) {
      const selectedImages = result.assets.map((image) => image.uri);
      setGalleryImages([...galleryImages, ...selectedImages]);
    } else if (result.uri) {
      setGalleryImages([result.uri, ...galleryImages]);
    }
  };

  // Function to post the data to the API
  const postData = async () => {
    const formData = new FormData();
    formData.append('text_content', postText);

    // Append each selected image to the form data
    galleryImages.forEach((imageUri, index) => {
      formData.append('images[]', {
        uri: imageUri,
        type: 'image/jpeg', // Change this based on your image type
        name: `image${index}.jpg`,
      });
    });

    try {
      const response = await fetch('https://zelesegna.com/convene/app/get_feed.php?event=1', { // Replace with your API endpoint
        method: 'POST',
        body: formData,
        headers: {
          // 'Content-Type': 'multipart/form-data', // Uncomment this line if necessary
        },
      });

      if (!response.ok) {
        const errorBody = await response.text(); // Get response body for more details
        console.error("Error response:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        Alert.alert('Success', 'Post created successfully!');
        navigation.navigate('Feed', { eventId: result.eventId }); // Navigate to feed after successful post
      } else {
        Alert.alert('Error', 'Failed to create post.');
      }
    } catch (error) {
      console.error("Error posting data:", error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  // Handle sharing the post
  const handleSharePress = () => {
    if (!postText && galleryImages.length === 0) {
      Alert.alert('Warning', 'Please add text or images to share.');
      return;
    }
    postData();
  };

  // Render each selected image in the VirtualizedList
  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageThumbnail} />
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Header with Close and Share buttons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Alert.alert("Post cancelled")}>
          <Icon name="close" size={30} color={currentTheme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.shareButton, { backgroundColor: currentTheme.primary }]} onPress={handleSharePress}>
          <Text style={[styles.shareText, { color: currentTheme.text }]}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Text Input for Post */}
      <TextInput
        style={[styles.input, { backgroundColor: currentTheme.secondary, color: currentTheme.text }]}
        placeholder="What's on your mind?"
        placeholderTextColor="#b0b0b0"
        multiline
        value={postText}
        onChangeText={setPostText}
      />

      {/* Camera and Image Picker Icons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={openCamera} style={[styles.iconButton, { backgroundColor: currentTheme.primary }]}>
          <Icon name="camera-outline" size={24} color={currentTheme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openImagePicker} style={[styles.iconButton, { backgroundColor: currentTheme.primary }]}>
          <Icon name="image-outline" size={24} color={currentTheme.text} />
        </TouchableOpacity>
      </View>

      {/* Display selected images */}
      <VirtualizedList
        data={galleryImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        getItemCount={() => galleryImages.length}
        getItem={(data, index) => data[index]}
        numColumns={3}
        style={styles.imageList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  shareButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  iconButton: {
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  imageList: {
    marginTop: 10,
  },
});