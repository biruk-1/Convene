import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for handling image upload
export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async ({ image, content, eventId }, { rejectWithValue }) => {
    try {
      // Get user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      
      // Extract file extension from the image URI
      const fileExtension = image.split('.').pop() || 'jpg'; // Default to jpg if no extension
      const fileType = `image/${fileExtension}`; // Dynamically set the MIME type

      // Prepare the form data
      const formData = new FormData();
      formData.append('image', {
        uri: image, // Image URI
        name: `upload.${fileExtension}`, // Dynamic file name with extension
        type: fileType, // Dynamic MIME type
      });
      formData.append('content', content);
      formData.append('user', userId || '1'); // Use actual user ID or fallback
      formData.append('event', eventId || '1'); // Use actual event ID or fallback

      // Make the API request
      const response = await fetch('https://zelesegna.com/convene/app/upload.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Parse response and check status
      const data = await response.json();
      console.log('API Response:', data); // Log the API response
      
      if (response.ok && data.status === 'success') {
        return { 
          ...data, 
          createdAt: new Date().toISOString(),
          imageUrl: data.imageUrl || data.url || image // Use returned URL or fallback to original
        };
      } else {
        throw new Error(data.message || data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      return rejectWithValue(error.message || 'Failed to upload file');
    }
  }
);

const imageSlice = createSlice({
  name: 'image',
  initialState: {
    image: null,
    content: '',
    uploading: false,
    uploadError: null,
    posts: [], // Array to store all posts
  },
  reducers: {
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    clearImage: (state) => {
      state.image = null;
      state.content = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.image = null;
        state.content = '';
        // Add the new post to the posts array
        state.posts.push({
          image: action.payload.imageUrl, // Assuming the API returns imageUrl
          content: state.content,
          createdAt: action.payload.createdAt, // Use the timestamp from the API response
        });
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload;
      });
  },
});

export const { setImage, setContent, clearImage } = imageSlice.actions;
export default imageSlice.reducer;