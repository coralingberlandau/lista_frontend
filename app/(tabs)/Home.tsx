import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListItem, RootStackParamList } from '../type';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';

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
        const response = await axios.get(`http://127.0.0.1:8000/grouplists/by-user/${storedUserId}/`, {
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

  return (

    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.greeting}>Hello, {username || 'Guest'}!</Text>
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
});

export default Home;
