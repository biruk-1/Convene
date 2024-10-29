import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, FlatList, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AddPostScreen() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [postText, setPostText] = useState('');

  // Request Camera and Gallery Permissions on load
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');
      setHasGalleryPermission(galleryStatus === 'granted');
    })();
  }, []);

  const openCamera = async () => {
    if (!hasCameraPermission) {
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

  const openImagePicker = async () => {
    if (!hasGalleryPermission) {
      Alert.alert("Permission required", "Gallery permission is required to select images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.cancelled) {
      const selectedImages = result.selected.map((image) => image.uri);
      setGalleryImages([...galleryImages, ...selectedImages]);
    } else {
      Alert.alert("Cancelled", "Image selection was cancelled.");
    }
  };

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageThumbnail} />
  );

  return (
    <View style={styles.container}>
      {/* Header with Close and Share buttons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Alert.alert("Post cancelled")}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert("Post shared successfully!")}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Text Input for Post */}
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor="#b0b0b0"
        multiline
        value={postText}
        onChangeText={setPostText}
      />

      {/* Camera Icon for taking photos */}
      <TouchableOpacity onPress={openCamera} style={styles.cameraButton}>
        <Icon name="camera-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Image Picker Icon for selecting from gallery */}
      <TouchableOpacity onPress={openImagePicker} style={styles.imagePickerButton}>
        <Icon name="image-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Display selected images */}
      <FlatList
        data={galleryImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={3}
        style={styles.imageList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#a349a4',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  shareText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#3a3a3a',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    textAlignVertical: 'top',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#a349a4',
    borderRadius: 25,
    padding: 15,
  },
  imagePickerButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#a349a4',
    borderRadius: 25,
    padding: 15,
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
