import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ListItem, RootStackParamList } from '../type';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type ListItemDetailsRouteProp = RouteProp<RootStackParamList, 'ListItemDetails'>;

const AddListDetails: React.FC = () => {
  const route = useRoute<ListItemDetailsRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

   // מגדיר את הפרמטר `item` עם הסוג ListItem
  const { item }: { item: ListItem } = route.params;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [listItems, setListItems] = useState<ListItem[]>([]);


  const handleDeleteItem = async (itemId: number) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/listitem/${itemId}/`, {
        is_active: false,
      });
      
      // עדכון הרשימה בדף הבית על ידי סינון הפריט שהוסר
      setListItems((prevItems) => prevItems.filter(item => item.id !== itemId));
      // סגירת המודל וחזרה לדף הבית
      setIsMenuVisible(false);
      // חזרה לדף הבית
      navigation.navigate('Home', { refresh: true });
    } catch (error) {
      console.error('Error updating item:', error, 'Item ID:', itemId);
    }
  };
  

  const handleUpdateList = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/listitem/${item.id}/`, {
        title,
        description,
      });
      setIsEditVisible(false);
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
          <Entypo name="dots-three-horizontal" size={35} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>Date Created: {item.date_created}</Text>
      <Text style={styles.status}>Status: {item.is_active ? 'Active' : 'Inactive'}</Text>

      <TouchableOpacity style={styles.updateButton} onPress={() => setIsEditVisible(true)}>
        <Text style={styles.updateButtonText}>Update List</Text>
      </TouchableOpacity>

      <Modal visible={isEditVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Update Title"
          />
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Update Description"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleUpdateList}>
            <Text style={styles.submitButtonText}>Submit Update</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditVisible(false)}>
            <Ionicons name="close-circle-outline" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isMenuVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="list-circle-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Add List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="color-palette-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Background</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="text-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Text Color</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="share-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteItem(item.id)}>
          {/* <TouchableOpacity style={styles.iconContainer} onPress={handleDeleteItem({item.id})}> */}
            <AntDesign name="delete" size={50} color="white" />
            <Text style={styles.iconLabel}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMenuVisible(false)} style={styles.iconContainer}>
            <Ionicons name="close-circle-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: 'green',
  },
  menuButton: {
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddListDetails;
