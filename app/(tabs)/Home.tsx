import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListItem, RootStackParamList } from '../type';
import AntDesign from '@expo/vector-icons/AntDesign';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ListItemDetails'>;

const Home: React.FC = () => {
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  );


  // http://127.0.0.1:8000/grouplists/ ------ get

  // http://127.0.0.1:8000/grouplists/by-user/1/ --- getby id


  // const fetchData = useCallback(async () רק מהליסטטאייטטםם=> {
  //   console.log('fetching');
  //   setListItems([]); // נקה את הרשימה לפני הטעינה
  //   const storedUsername = await AsyncStorage.getItem('userName');
  //   const storedUserId = await AsyncStorage.getItem('userId');
  //   const token = await AsyncStorage.getItem('token');

  //   if (storedUsername) {
  //     setUsername(storedUsername);
  //   }

  //   if (storedUserId && token) {
  //     setLoading(true);

  //     try {
  //       const response = await axios.get(`http://127.0.0.1:8000/listitem/by-user/${storedUserId}/`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       // סינון הרשימה להציג רק פריטים פעילים
  //       const activeItems = response.data.filter((item: ListItem) => item.is_active);
  //       setListItems(activeItems);
  //       // setListItems(response.data);
  //     } catch (error) {
  //       console.error('Error fetching user list items:', error);
  //       Alert.alert('Error', 'Failed to fetch your list items. Please try again later.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // }, []);

  const fetchData = useCallback(async () => {
    // נקה את הרשימה לפני טעינה חדשה
    setListItems([]);
    setLoading(true); // הצג את מצב הטעינה

    try {
      // שליפת המידע מ-AsyncStorage
      const storedUsername = await AsyncStorage.getItem('userName');
      const storedUserId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      console.log(token);

      if (!token) {
        throw new Error('No token found');
      }

      // אם יש שם משתמש, הגדר אותו
      if (storedUsername) {
        setUsername(storedUsername);
      }

      // אם יש userId ו-token, בצע את הבקשה
      if (storedUserId && token) {
        const response = await axios.get(`http://127.0.0.1:8000/grouplists/by-user/${storedUserId}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // הוסף את הטוקן בבקשה
          },
        });
      
        // סינון הרשימה להציג רק פריטים פעילים
        const activeItems = response.data.filter((item: ListItem) => item.is_active);
        console.log('response', response)
        setListItems(activeItems); // עדכון הרשימה
      }
    } catch (error) {
      console.error('Error fetching user list items:', error);
      Alert.alert('Error', 'Failed to fetch your list items. Please try again later.');
    } finally {
      setLoading(false); // סיים את מצב הטעינה
    }
  }, []); // הפונקציה תתעדכן רק פעם אחת


  // פונקציה עבור ניווט ליצירת פריט חדש
  const handleAddListItem = () => {
    navigation.navigate('ListItemDetails');
  };
  // פונקציה עבור ניווט להצגת פרטי האייטם שנבחר
  const handlePressItem = (item: ListItem) => {
    navigation.navigate('ListItemDetails', { item }); // ניווט עם פרטי האייטם
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.greeting}>Hello, {username || 'Guest'}!</Text>
          <Text style={styles.title}>
            {/* Your List: */}
            {listItems.length === 0 ? "Write your dreams here!" : `Your List: ${listItems.length} items`}
          </Text>

          <FlatList
            data={listItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePressItem(item)}>
                <View style={styles.listItem}>
                  <Text style={styles.boldText}>{item.title}</Text>

                  <Text numberOfLines={3} ellipsizeMode="tail" style={styles.descriptionText}>
                    {Array.isArray(item.description)
                      ? item.description.join('\n') // אם הוא מערך, מאחד אותו למחרוזת
                      : item.description // אחרת, משתמש במחרוזת כמו שהיא
                    }
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddListItem} // עדכון ניווט
          >
            <AntDesign name="pluscircleo" size={45} color="black" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18, // הגדר את גודל הכתב כאן
  },
  descriptionText: {
    fontSize: 16, // גודל טקסט עבור התיאור
    lineHeight: 24, // ריווח בין שורות להבלטה ואסתטיקה
    color: '#333',
    marginTop: 5, // מעט ריווח מעל, כדי להפריד מהכותרת
  },
});

export default Home;