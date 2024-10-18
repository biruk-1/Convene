import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, PermissionsAndroid, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AddPostScreen() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  // Request Camera Permission on load
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      } else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      }
    })();
  }, []);

  const openCamera = async () => {
    if (hasCameraPermission === null) {
      Alert.alert("Permission required", "Camera permission is required to take pictures.");
      return;
    }
    if (!hasCameraPermission) {
      Alert.alert("Permission denied", "You need to allow camera access from your device settings.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setGalleryImages([result.uri, ...galleryImages]);
    }
  };

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true });
    if (!result.cancelled) {
      setGalleryImages([...galleryImages, ...result.selected]);
    }
  };

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={{ width: 100, height: 100, margin: 5 }} />
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Add a New Post</Text>

      {/* Select Image from Gallery */}
      <TouchableOpacity onPress={openImagePicker} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="images-outline" size={30} />
        <Text style={{ marginLeft: 10 }}>Select from gallery</Text>
      </TouchableOpacity>

      {/* Camera Option */}
      <TouchableOpacity onPress={openCamera} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="camera-outline" size={30} />
        <Text style={{ marginLeft: 10 }}>Take a picture</Text>
      </TouchableOpacity>

      {/* Display selected images */}
      <FlatList
        data={galleryImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={3}
      />
    </View>
  );
}
