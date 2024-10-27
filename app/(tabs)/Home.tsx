import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; 
import { RootStackParamList } from '../type';
import AntDesign from '@expo/vector-icons/AntDesign';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddListItem'>;

interface ListItem {
  id: number;
  title: string;
  description: string;
  date_created: string;
  is_active: boolean;
}

const Home: React.FC = () => {
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('fetching');
    const storedUsername = await AsyncStorage.getItem('userName');
    const storedUserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedUserId && token) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/listitem/by-user/${storedUserId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setListItems(response.data);
      } catch (error) {
        console.error('Error fetching user list items:', error);
        Alert.alert('Error', 'Failed to fetch your list items. Please try again later.');
      }
    }
    
    setLoading(false);
  };

  const handleAddListItem = () => {
    navigation.navigate('AddListItem', {
      onGoBack: fetchData, // העברת פונקציה לעדכון הרשימה
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.title}>Your List:</Text>
          <Text style={styles.greeting}>Hello, {username || 'Guest'}!</Text>

          <FlatList
            data={listItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>Title: {item.title}</Text>
                <Text>Description: {item.description}</Text>
                <Text>Date Created: {item.date_created}</Text>
                <Text>Status: {item.is_active ? 'Active' : 'Inactive'}</Text>
              </View>
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
    fontSize: 18,
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
});

export default Home;
