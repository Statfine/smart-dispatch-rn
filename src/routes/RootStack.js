import * as React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomePage from '../page/HomePage';

const Stack = createStackNavigator();

function RootStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen name="HomePage" component={HomePage} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

export default RootStack;
