import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DeviceEventEmitter } from 'react-native';

import LoginPage from '../page/LoginPage';
import DetailPage from '../page/DetailPage';
import PathPlanPage from '../page/PathPlanPage';
import WellcomePage from '../page/WelcomePage';
import MessagePage from '../page/MessagePage';
import HistoryPage from '../page/HistoryPage';
import SidebarDrawer from '../components/SidebarDrawer';

import RootStack from './RootStack';
import { setRouters, setNav } from '../utils/NavigationService';
import { EVENT_DRAWER } from '../utils/EventBus';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

/**
 *  todo  待优化
 *    此处多进行一层Navigator设置，为了再Main下抽取一个公共类获取router
 */
function Screen() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="WellcomePage" component={WellcomePage} />
      <Stack.Screen name="Home" component={Draw} />
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="DetailPage" component={DetailPage} />
      <Stack.Screen name="PathPlanPage" component={PathPlanPage} />
      <Stack.Screen name="MessagePage" component={MessagePage} />
      <Stack.Screen name="HistoryPage" component={HistoryPage} />
    </Stack.Navigator>
  );
}

function Draw() {
  return (
    <Drawer.Navigator
      initialRouteName="Draw"
      openByDefault={false}
      drawerContent={(props) => <SidebarDrawer data={props} />}>
      <Drawer.Screen
        name="Draw"
        component={RootStack}
        listeners={{
          drawerOpen: (e) => {
            // 抽屉的打开事件通过 DeviceEventEmitter进行订阅发布
            DeviceEventEmitter.emit(EVENT_DRAWER);
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const navigationRef = React.useRef(null);

  React.useEffect(() => {
    setNav(navigationRef);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          headerMode="none"
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <Stack.Screen
            name="Main"
            component={Screen}
            options={({ route, navigation }) => setRouters(route, navigation)}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
