# Convene App - Codebase Documentation

## Overview
Convene is a React Native mobile application built with Expo that serves as an event management and social networking platform for conference participants. The app allows users to view events, share posts, ask questions, view schedules, and interact with other participants.

## Technology Stack
- **Framework**: React Native with Expo SDK 53
- **Navigation**: React Navigation (Stack Navigator)
- **State Management**: Redux Toolkit + React Context
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: Custom components with theme support
- **Image Handling**: Expo Image Picker
- **HTTP Client**: Fetch API for backend communication
- **Styling**: StyleSheet with theme-based styling

## Project Structure

### Core Files
- `app.json` - Expo configuration
- `package.json` - Dependencies and scripts
- `app/_layout.tsx` - Root layout configuration
- `app/index.js` - Main navigation setup

### App Directory Structure

```
app/
├── _layout.tsx              # Root layout
├── index.js                 # Main navigation container
├── screens/                 # All application screens
├── Components/              # Reusable UI components
├── context/                 # React Context providers
├── Data/                    # Static JSON data files
├── styles/                  # Global styling
├── store.js                 # Redux store configuration
├── imageSlice.js            # Redux slice for image handling
└── utils/                   # Utility functions
```

## Screen Documentation

### 1. SplashScreen (`app/screens/SplashScreen.tsx`)
**Purpose**: Initial loading screen that checks user authentication status
**Functionality**:
- Displays app logo and branding
- Checks AsyncStorage for existing login session
- Automatically navigates to EventList if user is logged in
- Redirects to Login screen after 3 seconds if not logged in
- Brand color: #cc0077 (pink/magenta)

### 2. LoginScreen (`app/screens/LoginScreen.js`)
**Purpose**: User authentication interface
**Functionality**:
- Email and password input fields
- Password hashing using CryptoJS SHA512
- API integration with `https://zelesegna.com/convene/app/mobileLogin.php`
- Stores user session in AsyncStorage
- Supports theme switching (light/dark mode)
- Error handling for invalid credentials
- "Forgot Password" functionality (placeholder)

### 3. EventList (`app/screens/EventList.js`)
**Purpose**: Displays list of events the user is registered for
**Functionality**:
- Fetches user events from `https://zelesegna.com/convene/app/get_user_event.php`
- Displays event name and organization
- Clickable event cards that navigate to Feed screen
- Sets event context for the selected event
- Error handling for network issues

### 4. FeedScreen (`app/screens/FeedScreen.js`)
**Purpose**: Main social feed interface
**Functionality**:
- Container for the Feed component
- Includes FeedbackHeader component
- Fixed footer navigation
- Theme-aware styling

### 5. Feed Component (`app/Components/Feed.js`)
**Purpose**: Displays social media-style posts from event participants
**Functionality**:
- Fetches posts from `https://zelesegna.com/convene/app/get_feed.php`
- Displays user profile pictures, names, and positions
- Shows post images with full-screen modal view
- Text content with "Show More/Less" functionality
- Like and comment counters (UI only)
- Pull-to-refresh functionality
- Error handling and loading states

### 6. AddPostScreen (`app/screens/AddPostScreen.js`)
**Purpose**: Create and share new posts with images
**Functionality**:
- Text input for post content
- Image selection from camera or gallery
- Redux integration for state management
- Image upload to `https://zelesegna.com/convene/app/upload.php`
- Floating action buttons for camera/gallery access
- Form validation and error handling

### 7. QuestionsPage (`app/screens/QuestionsPage.js`)
**Purpose**: Q&A interface for event participants
**Functionality**:
- Tabbed interface (Questions/Answers)
- Fetches questions from `https://zelesegna.com/convene/app/get_questions.php`
- Displays question details with user information
- Like/vote functionality (UI only)
- "Ask a Question" button navigation
- Empty state handling

### 8. AskQuestion (`app/screens/AskQuestion.js`)
**Purpose**: Submit new questions to the event
**Functionality**:
- Text input for question content
- Anonymous vs. named question options
- API integration with `https://zelesegna.com/convene/app/ask_question.php`
- Form validation
- Success/error feedback

### 9. CalendarView (`app/screens/CalendarView.js`)
**Purpose**: Event schedule and meeting management
**Functionality**:
- Horizontal date picker with gesture support
- Fetches schedule from `https://zelesegna.com/convene/app/get_schedule.php`
- Displays meeting times, topics, and locations
- Meeting status indicators (past, ongoing, future)
- Gesture-based navigation between date ranges
- Empty state for dates without meetings

### 10. Profile (`app/screens/Profile.js`)
**Purpose**: User profile and settings management
**Functionality**:
- User profile display with editable image
- Settings menu items (Change Password, Notifications, Report Problem)
- Logout functionality with confirmation
- Session management integration
- Theme-aware styling

### 11. Feedback (`app/screens/FeedBack.js`)
**Purpose**: Event feedback collection interface
**Functionality**:
- Multi-step questionnaire interface
- 5 predefined questions about event satisfaction
- 5-point rating scale options
- Progress indicators
- Form submission handling (placeholder)

## Component Documentation

### Footer (`app/Components/Footer.js`)
**Purpose**: Bottom navigation bar
**Functionality**:
- 5 navigation tabs: Feed, Calendar, Add Post, Questions, Profile
- Active tab highlighting
- Icon-based navigation using Ionicons
- Context-aware navigation with event ID

### Modern Components
The app includes several "Modern" prefixed components that appear to be updated UI versions:
- `ModernButton.js`
- `ModernFooter.js`
- `ModernHeader.js`
- `ModernInput.js`
- `ModernLoading.js`
- `ModernPostCard.js`
- `ModernEventList.js`
- `ModernFeedScreen.js`
- `ModernLoginScreen.js`
- `ModernSplashScreen.tsx`

## Context Providers

### ThemeContext (`app/context/ThemeContext.js`)
**Purpose**: Global theme management
**Functionality**:
- Automatic light/dark theme detection
- System appearance change listeners
- Theme context provider for app-wide access

### Themes (`app/context/themes.js`)
**Purpose**: Theme color definitions
**Light Theme**:
- Background: #F5F3FC (soft light gray)
- Text: #333333 (dark gray)
- Primary: #31083D (purple/magenta)
- Secondary: #F4F1FA (light purple)

**Dark Theme**:
- Background: #000004 (very dark)
- Text: #CCCCCC (light gray)
- Primary: #31083D (purple/magenta)
- Secondary: #161616 (dark gray)

### AuthContext (`app/screens/AuthContext.js`)
**Purpose**: User authentication state management
**Functionality**:
- User session persistence with AsyncStorage
- Login/logout state management
- Automatic session restoration
- Navigation integration

### EventIdContext (`app/context/EventIdContext.js`)
**Purpose**: Current event context management
**Functionality**:
- Stores currently selected event ID
- Provides event context across components
- Default event ID: 1

## State Management

### Redux Store (`app/store.js`)
**Purpose**: Global state management
**Configuration**:
- Redux Toolkit setup
- Image slice integration

### Image Slice (`app/imageSlice.js`)
**Purpose**: Image upload state management
**Functionality**:
- Async thunk for image uploads
- Form data handling
- Upload progress tracking
- Error handling
- Post creation integration

## Data Files

### Static Data (`app/Data/`)
- `users.json` - Sample user credentials
- `posts.json` - Sample post data structure
- `questions.json` - Sample question data
- `calendar.json` - Sample calendar data

## API Endpoints

The app integrates with several backend endpoints:
- `mobileLogin.php` - User authentication
- `get_user_event.php` - Fetch user events
- `get_feed.php` - Fetch social feed posts
- `upload.php` - Upload images and posts
- `get_questions.php` - Fetch Q&A data
- `ask_question.php` - Submit new questions
- `get_schedule.php` - Fetch event schedule

## Key Features

1. **Event Management**: Users can view and participate in events
2. **Social Networking**: Post sharing with images and text
3. **Q&A System**: Anonymous and named question submission
4. **Schedule Management**: Interactive calendar with meeting details
5. **Theme Support**: Light and dark mode with system detection
6. **Offline Persistence**: Session management with AsyncStorage
7. **Image Handling**: Camera and gallery integration
8. **Responsive Design**: Theme-aware UI components

## Navigation Flow

1. **SplashScreen** → Checks authentication
2. **LoginScreen** → User authentication
3. **EventList** → Select event
4. **FeedScreen** → Main social feed
5. **Footer Navigation** → Switch between features:
   - Feed (social posts)
   - Calendar (schedule)
   - Add Post (create content)
   - Questions (Q&A)
   - Profile (settings)

## Development Notes

- The app uses Expo SDK 53 with React Native 0.77
- Implements modern React patterns (hooks, context, functional components)
- Follows a component-based architecture
- Includes comprehensive error handling
- Supports both iOS and Android platforms
- Uses TypeScript for some components (`.tsx` files)
- Implements responsive design principles

## Potential Improvements

1. Implement real-time features (WebSocket integration)
2. Add push notifications
3. Enhance offline functionality
4. Implement proper error boundaries
5. Add unit and integration tests
6. Optimize image loading and caching
7. Implement proper form validation
8. Add accessibility features 