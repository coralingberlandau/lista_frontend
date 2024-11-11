import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Toast from 'react-native-toast-message';

import Home from './(tabs)/Home';
import Login from './Login';
import Register from './Register';
import ListItemDetails from './ListItemDetails';
import Settings from './(tabs)/Settings';
import { RootStackParamList } from './type';
import ResetPassword from './ResetPassword';

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        token && setIsLoggedIn(true);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>

          <Tab.Screen name="Home" component={Home}
            options={{
              title: 'Home', tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />),
              headerShown: false,
            }} />

          <Tab.Screen name="ListItemDetails" component={ListItemDetails}
            options={{ tabBarButton: () => null, headerShown: false, title: 'List Item Details' }}
          />
          <Tab.Screen
            name="Settings"
            children={(props) => <Settings {...props} setIsLoggedIn={setIsLoggedIn} />} // מעבירים את setIsLoggedIn כ-Prop
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
              ),
              headerShown: false,
            }}
          />

        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>

          <Stack.Screen name="Register" options={{ headerShown: false }}>
            {(props) => <Register {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>


            <Stack.Screen name="ResetPassword" component={ResetPassword} 
            options={{ headerShown: false , title: 'Reset Password' }} 
          />





        </Stack.Navigator>
      )}
      <Toast />
    </NavigationContainer>
  );
}
registerRootComponent(App);
