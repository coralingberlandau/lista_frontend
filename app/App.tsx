import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Toast from 'react-native-toast-message';

// Import your screens
import Home from './(tabs)/Home';
import Login from './Login';
import Register from './Register';
// import AddListItem from './AddListItem';
import ListItemDetails from './ListItemDetails';
import Settings from './(tabs)/Settings';
import { RootStackParamList } from './type';

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // using boolean | null for loading state
  const toastRef = useRef<any>(null);


  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        token && setIsLoggedIn(true); // If token exists, set isLoggedIn to true, otherwise false
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false); // Set to false if there's an error
      }
    };

    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          {/* שימוש ב-Stack בתוך Tab */}
          <Tab.Screen name="Home" component={Home}
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
            }} />

          {/* <Tab.Screen name="AddListItem" component={AddListItem}
            options={{ tabBarButton: () => null }}
          /> */}

          <Tab.Screen name="ListItemDetails" component={ListItemDetails}
            options={{ tabBarButton: () => null }}
          />

          <Tab.Screen name="Settings" component={Settings}
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
              ),
            }}
          />

          {/* ניתן להוסיף מסכים נוספים כאן */}
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>


          {/* <Stack.Screen name="Register" component={Register} /> */}

          <Stack.Screen name="Register">
            {(props) => <Register {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>







        </Stack.Navigator>
      )}
      <Toast />

    </NavigationContainer>
  );
}
registerRootComponent(App);
