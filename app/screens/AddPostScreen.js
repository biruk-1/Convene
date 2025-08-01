import React, { useEffect, useContext, useState } from 'react';
import { 
  Alert, 
  TouchableOpacity, 
  TextInput, 
  View, 
  Text, 
  Image, 
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setImage, setContent, clearImage, uploadImage } from '../imageSlice';
import { useEventId } from '../context/EventIdContext';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';

const { width, height } = Dimensions.get('window');

const AddPostScreen = () => {
  const { eventId } = useEventId();
  const dispatch = useDispatch();
  const { image, content, uploading, uploadError } = useSelector(state => state.image);
  const navigation = useNavigation();
  const [imagePreview, setImagePreview] = useState(null);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Function to select an image (camera or gallery)
  const pickImage = async (source) => {
    try {
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
           aspect: [4, 3],
           quality: 0.8,
         });
       } else {
         result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images,
           allowsEditing: true,
           aspect: [4, 3],
           quality: 0.8,
         });
       }

      // Set the selected image URI in state
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        dispatch(setImage(selectedImageUri));
        setImagePreview(selectedImageUri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Function to handle image and content upload
  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Missing Image', 'Please add an image to your post.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please add some text to your post.');
      return;
    }

    try {
      const result = await dispatch(uploadImage({ image, content, eventId })).unwrap();
      console.log('API Response:', result);
      Alert.alert('Success', 'Post uploaded successfully!', [
        {
          text: 'OK',
                       onPress: () => {
               dispatch(clearImage());
               setImagePreview(null);
               navigation.navigate('Feed', { eventId });
             }
        }
      ]);
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'Failed to upload post. Please try again.');
    }
  };

  const handleCancel = () => {
    dispatch(clearImage());
    setImagePreview(null);
    navigation.goBack();
  };

  useEffect(() => {
    if (uploadError) {
      Alert.alert('Error', uploadError);
    }
  }, [uploadError]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={currentTheme.background} 
      />
      
               {/* Header Section */}
         <View style={[styles.header, { backgroundColor: currentTheme.background }]}>
           <View style={styles.headerTopRow}>
             <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
               <Text style={[styles.cancelText, { color: currentTheme.text }]}>Cancel</Text>
             </TouchableOpacity>
             <Text style={[styles.headerTitle, { color: currentTheme.text }]}>New Post</Text>
             <TouchableOpacity 
               onPress={handleUpload} 
               disabled={uploading || !image || !content.trim()}
               style={[
                 styles.shareButton, 
                 { 
                   opacity: (uploading || !image || !content.trim()) ? 0.5 : 1,
                   backgroundColor: currentTheme.background 
                 }
               ]}
             >
               {uploading ? (
                 <ActivityIndicator size="small" color="#4A148C" />
               ) : (
                 <Text style={[styles.shareText, { color: '#4A148C' }]}>Share</Text>
               )}
             </TouchableOpacity>
           </View>
         </View>

         <KeyboardAvoidingView 
           style={{ flex: 1 }}
           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
         >
           <ScrollView 
             style={styles.scrollContainer}
             contentContainerStyle={styles.scrollContent}
             showsVerticalScrollIndicator={false}
             keyboardShouldPersistTaps="handled"
             keyboardDismissMode="interactive"
           >
             {/* Image Selection Area */}
             <View style={styles.imageSection}>
               {imagePreview ? (
                 <View style={styles.imageContainer}>
                   <Image source={{ uri: imagePreview }} style={styles.selectedImage} />
                   <TouchableOpacity 
                     style={styles.removeImageButton}
                     onPress={() => {
                       dispatch(clearImage());
                       setImagePreview(null);
                     }}
                   >
                     <Icon name="close-circle" size={24} color="#FF3B30" />
                   </TouchableOpacity>
                 </View>
               ) : (
                 <View style={[styles.imagePlaceholder, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa' }]}>
                   <Icon name="camera-outline" size={48} color="#999" />
                   <Text style={[styles.placeholderText, { color: currentTheme.text }]}>
                     Add a photo to your post
                   </Text>
                   <View style={styles.imageButtonsContainer}>
                     <TouchableOpacity 
                       style={[styles.imageButton, { backgroundColor: '#4A148C' }]}
                       onPress={() => pickImage('camera')}
                     >
                       <Icon name="camera" size={20} color="#fff" />
                       <Text style={styles.imageButtonText}>Camera</Text>
                     </TouchableOpacity>
                     <TouchableOpacity 
                       style={[styles.imageButton, { backgroundColor: '#4A148C' }]}
                       onPress={() => pickImage('gallery')}
                     >
                       <Icon name="images" size={20} color="#fff" />
                       <Text style={styles.imageButtonText}>Gallery</Text>
                     </TouchableOpacity>
                   </View>
                 </View>
               )}
             </View>

             {/* Content Input Area */}
             <View style={styles.contentSection}>
               <Text style={[styles.contentLabel, { color: currentTheme.text }]}>
                 Write your post content
               </Text>
               <TextInput
                 style={[styles.contentInput, { 
                   color: currentTheme.text,
                   backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                   borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                 }]}
                 placeholder="Share your thoughts, experiences, or updates about the event..."
                 placeholderTextColor={theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#999'}
                 value={content}
                 onChangeText={(text) => dispatch(setContent(text))}
                 multiline
                 textAlignVertical="top"
                 maxLength={500}
               />
               <Text style={[styles.characterCount, { color: currentTheme.text }]}>
                 {content.length}/500 characters
               </Text>
             </View>
           </ScrollView>
         </KeyboardAvoidingView>

         <Footer />
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 28,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  imageSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: width * 0.75,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  imagePlaceholder: {
    width: '100%',
    height: width * 0.75,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    minHeight: 140,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 20,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
    opacity: 0.6,
  },
});

export default AddPostScreen;