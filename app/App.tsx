import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

// Import your screens
import Home from './(tabs)/Home';
import Login from './Login';
import Register from './Register';
import AddListItem from './(tabs)/AddListItem';
import Settings from './(tabs)/Settings';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  AddListItem: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // using boolean | null for loading state

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token); // If token exists, set isLoggedIn to true, otherwise false
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
          }}/>
           
          <Tab.Screen name="AddListItem" component={AddListItem}
          options={{
            title: 'Add List',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color}  />
            ),
          }} />
          <Tab.Screen name="Settings" component={Settings} 
           options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color}  />
            ),
          }}/>

          {/* ניתן להוסיף מסכים נוספים כאן */}
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}













  // (
//     <NavigationContainer>
//       {isLoggedIn ? (
//         <Tab.Navigator>
//           {/* <Tab.Screen name="Home" component={Home} /> */}
//           <Tab.Screen name="Home" component={HomeStack} /> {/* שימוש ב-Stack בתוך Tab */}

//           {/* Add other tab screens here */}
//         </Tab.Navigator>
//       ) : (
//         <Stack.Navigator>
//           {/* <Stack.Screen name="Login">
//               {() => <Login setIsLoggedIn={setIsLoggedIn} />}
//             </Stack.Screen> */}
//           <Stack.Screen name="Login" component={() => <Login setIsLoggedIn={setIsLoggedIn} />} />
//           <Stack.Screen name="Register" component={Register} />
//         </Stack.Navigator>
//       )}
//     </NavigationContainer>
//   );
// };
// (
// <NavigationContainer>
//   {isLoggedIn ? (
//     <Tab.Navigator>
//       {/* שימוש ב-Stack בתוך Tab */}
//       <Tab.Screen name="Home" component={HomeStack} />
//       {/* מסכים נוספים */}
//     </Tab.Navigator>
//   ) : (
//     <Stack.Navigator>
//       {/* העבר את הפונקציה בצורה נכונה */}
//       <Stack.Screen name="Login">
//         {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
//       </Stack.Screen>
//       <Stack.Screen name="Register" component={Register} />
//     </Stack.Navigator>
//   )}
// </NavigationContainer>








// function HomeStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={Home} />
//       <Stack.Screen name="AddListItem" component={AddListItem} /> {/* מסך הוספת רשימה */}
//     </Stack.Navigator>
//   );
// }
// )
registerRootComponent(App);
