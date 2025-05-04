module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: ['react-native-reanimated/plugin']
    };
  };
  
  // App.js
  import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { AuthProvider } from './src/context/AuthContext';
  import AppNavigator from './src/navigation/AppNavigator';
  import { StatusBar } from 'expo-status-bar';
  
  export default function App() {
    return (
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    );
  }