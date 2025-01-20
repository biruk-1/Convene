import React, { useEffect, useContext } from 'react';
import { Alert, TouchableOpacity, TextInput, View, Text, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setImage, setContent, clearImage, uploadImage } from '../imageSlice';
import { useEventId } from '../context/EventIdContext';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

// Component for handling image and content upload
const AddPostScreenContent = () => {
  const { eventId } = useEventId();
  const dispatch = useDispatch();
  const { image, content, uploading, uploadError } = useSelector(state => state.image);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Function to select an image (camera or gallery)
  const pickImage = async (source) => {
    let permissionResult;

    if (source === 'camera') {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.status !== 'granted') {
      Alert.alert('Permission Required', `Please grant ${source} permission to upload an image.`);
      return;
    }

    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    }

    // Set the selected image URI in state
    if (!result.canceled && result.assets) {
      const selectedImageUri = result.assets[0].uri;
      dispatch(setImage(selectedImageUri)); // Dispatch action to set image
      Alert.alert('Image Selected', 'Your image has been added.');
    } else {
      Alert.alert('Image Selection Cancelled', 'No image was selected.');
    }
  };

  // Function to handle image and content upload
  const handleUpload = async () => {
    if (!image || !content) {
      Alert.alert('Missing Fields', 'Please add an image and content.');
      return;
    }

    try {
      const result = await dispatch(uploadImage({ image, content, eventId })).unwrap();
      console.log('API Response:', result); // Log the API response
      Alert.alert('Success', 'Post uploaded successfully!');
      dispatch(clearImage()); // Clear the image state
      dispatch(setContent('')); // Clear the content state
    } catch (error) {
      console.error('Upload Error:', error); // Log the error
      Alert.alert('Error', 'Failed to upload post. Please try again.');
    }
  };

  useEffect(() => {
    if (uploadError) {
      Alert.alert('Error', uploadError);
    }
  }, [uploadError]);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => {}}>
        <FontAwesome name="close" size={24} color={currentTheme.text} />
      </TouchableOpacity>

      {/* Text input for content */}
      <TextInput
        style={[styles.input, { backgroundColor: currentTheme.tertiary, color: currentTheme.text }]}
        placeholder="What's on your mind?"
        placeholderTextColor={currentTheme.placeholder}
        value={content}
        onChangeText={(text) => dispatch(setContent(text))} // Dispatch action to set content
        multiline
      />

      {/* Display selected image */}
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {/* Upload button */}
      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: currentTheme.button }]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={[styles.shareButtonText, { color: currentTheme.text, backgroundColor: currentTheme.primary }]}>
          {uploading ? 'Uploading...' : 'Share'}
        </Text>
      </TouchableOpacity>

      {/* Floating buttons for camera and gallery */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: currentTheme.floatingButton }]}
          onPress={() => pickImage('gallery')}
        >
          <FontAwesome name="image" size={24} color={currentTheme.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: currentTheme.floatingButton }]}
          onPress={() => pickImage('camera')}
        >
          <FontAwesome name="camera" size={24} color={currentTheme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AddPostScreen = () => <AddPostScreenContent />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  input: {
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginVertical: 20,
    flex: 0.5,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
    marginVertical: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  shareButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    right: 20,
  },
  shareButtonText: {
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 15,
  },
  floatingButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default AddPostScreen;