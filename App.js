import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

// Auth Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

// Main Screens
import HomeScreen from './screens/HomeScreen';
import DoctorsScreen from './screens/DoctorsScreen';
import DoctorDetailsScreen from './screens/DoctorDetailsScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import BookingScreen from './screens/BookingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AppointmentDetailsScreen from './screens/AppointmentDetailsScreen';
import EditProfileScreen from './screens/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Doctors') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2B65EC',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Doctors" component={DoctorsScreen} />
      <Tab.Screen name="Appointments" component={AppointmentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    // Check if first launch
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });

    // Check if user is logged in
    AsyncStorage.getItem('userToken').then((token) => {
      setUserToken(token);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {isFirstLaunch && !userToken ? (
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen} 
            options={{ headerShown: false }} 
          />
        ) : userToken ? (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={TabNavigator} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="DoctorDetails" 
              component={DoctorDetailsScreen} 
              options={{ headerTitle: 'Doctor Details' }} 
            />
            <Stack.Screen 
              name="Booking" 
              component={BookingScreen} 
              options={{ headerTitle: 'Book Appointment' }} 
            />
            <Stack.Screen 
              name="Payment" 
              component={PaymentScreen} 
              options={{ headerTitle: 'Payment' }} 
            />
            <Stack.Screen 
              name="PaymentSuccess" 
              component={PaymentSuccessScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen} 
              options={{ headerTitle: 'Notifications' }} 
            />
            <Stack.Screen 
              name="AppointmentDetails" 
              component={AppointmentDetailsScreen} 
              options={{ headerTitle: 'Appointment Details' }} 
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen} 
              options={{ headerTitle: 'Edit Profile' }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerTitle: 'Create Account' }} 
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen} 
              options={{ headerTitle: 'Forgot Password' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}