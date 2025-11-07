import "./global.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './types';

// Import screens
import Scanner from './app/Scanner';
import Success from './app/Success';
import Failed from './app/Failed';
import History from './app/History';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Scanner"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen 
          name="Scanner" 
          component={Scanner}
        />
        <Stack.Screen 
          name="Success" 
          component={Success}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="Failed" 
          component={Failed}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="History" 
          component={History}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
