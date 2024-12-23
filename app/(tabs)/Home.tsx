import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListItem, RootStackParamList } from '../type';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ListItemDetails'>;

type HomeProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
};

const Home: React.FC<HomeProps> = ({ setIsLoggedIn }) => {
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();
  const SERVER = "https://lista-backend-n3la.onrender.com"


  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  );

  const fetchData = useCallback(async () => {
    setListItems([]);
    setLoading(true);

    try {
      const storedUsername = await AsyncStorage.getItem('userName');
      const storedUserId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }
      if (storedUsername) {
        setUsername(storedUsername);
      }

      if (storedUserId && token) {
        const response = await axios.get(`${SERVER}/grouplists/by-user/${storedUserId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const activeItems = response.data.filter((item: ListItem) => item.is_active);
        setListItems(activeItems);
      }
    } catch (error) {
      console.error('Error fetching user list items:', error);
      Alert.alert('Error', 'Failed to fetch your list items. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddListItem = () => {
    navigation.navigate('ListItemDetails');
  };
  const handlePressItem = (item: ListItem) => {
    navigation.navigate('ListItemDetails', { listItem: item });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({
        type: 'error',
        text1: 'Error logging out',
        text2: 'Please try again later',
      });
    }
  };

  return (

    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}> ⏳ Loading...</Text>
      ) : (
        <>
          <Text style={styles.greeting}>Hello, {username || 'Guest'}!</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <AntDesign name="logout" size={20} color="red" />
            <Text style={styles.iconLabelLogout}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
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
                    {item.items.split('|').join('\n')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddListItem}>
            <AntDesign name="pluscircleo" size={45} color="black" />
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
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
    fontSize: 18,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginTop: 5,
  },
  loadingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#5F9EA0',
  },

  logoutButton: {
    backgroundColor: 'whit',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  iconLabelLogout: {
    color: 'black',
    marginTop: 5,
    fontSize: 14,
  },
});

export default Home;
