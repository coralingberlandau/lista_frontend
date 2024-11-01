import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ListItem, RootStackParamList } from '../type';
import { Ionicons, AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

type ListItemDetailsRouteProp = RouteProp<RootStackParamList, 'ListItemDetails'>;

const ListItemDetails: React.FC = () => {
  const route = useRoute<ListItemDetailsRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const { item }: { item: ListItem } = route.params;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState<string[]>(item.description || ['']);
  const [listItems, setListItems] = useState<ListItem[]>([]);

  useEffect(() => {
    setDescription(item.description || ['']);
  }, [item.description]);


  const handleDeleteItem = async (itemId: number) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/listitem/${itemId}/`, {
        is_active: false,
      });
      Toast.show({
        type: 'success',
        text1: 'The item has been deleted successfully!',
      });
      setListItems((prevItems) => prevItems.filter(item => item.id !== itemId));
      setIsMenuVisible(false);
      navigation.navigate('Home', { refresh: true });
    } catch (error) {

      Toast.show({
        type: 'error',
        text1:'Error deleting the item',
        text2: 'Please try again later',
      });
      console.error('Error updating item:', error, 'Item ID:', itemId);
    }
  };


  // שינוי קל בקוד הפונקציה
  const handleUpdateList = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8000/listitem/${item.id}/`, {
        title,
        description,
      });
      Toast.show({
        type: 'success',
        text1: 'The list has been update successfully!',
      });

      setIsEditVisible(false);
      navigation.navigate('Home', { refresh: true }); // עדכון הניווט לדף הבית לאחר העדכון
    } catch (error) {
      Toast.show({
        type: 'error',
        text1:'Error update the item',
        text2: 'Please try again later',

      });
      console.error('Error updating list:', error);
    }
  };

  const handleDescriptionChange = (text: string, index: number) => {
    const newDescription = [...description];
    newDescription[index] = text;
    setDescription(newDescription);
  };

  const handleToggleItem = (index: number) => {
    const newDescription = [...description];
    const itemIndex = newDescription[index].indexOf('✔️');
    newDescription[index] = itemIndex > -1 ? newDescription[index].replace('✔️', '') : `✔️ ${newDescription[index]}`;
    setDescription(newDescription);
  };

  const handleAddImage = (itemId: number) => {
    // כאן אתה יכול לכתוב את הלוגיקה להוספת תמונה
    console.log(`Add image to item with ID: ${itemId}`);
    // לדוגמה, תוכל לפתוח דיאלוג לבחור קובץ או מצלמה
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.title}>{item.title}</Text> */}
        <TextInput
          style={styles.titleInput} // הגדר סגנון מותאם לשדה הכותרת
          value={title}
          onChangeText={setTitle} // עדכון הכותרת בהתאם
          placeholder="Edit Title" // טקסט חלופי
        />
        <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
          <Entypo name="dots-three-horizontal" size={35} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={description}
        renderItem={({ item, index }) => (
          <View style={styles.descriptionItem}>
            <TextInput
              style={[
                styles.textArea,
                {
                  textDecorationLine: item.includes('✔️') ? 'line-through' : 'none',
                  flex: 2, // מוסיף את האפשרות למלא את השטח
                  minHeight: 100, // גובה מינימלי
                },
              ]}
              placeholder="Write here..."
              multiline={true}
              value={item}
              onChangeText={(text) => handleDescriptionChange(text, index)}
            />
            <TouchableOpacity onPress={() => handleToggleItem(index)}>
              <FontAwesome name={item.includes('✔️') ? "check-square-o" : "square-o"} size={24} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />

      {/* // כפתור העדכון - כעת מפעיל ישירות את הפונקציה handleUpdateList */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateList}>
        <Text style={styles.updateButtonText}>Update List</Text>
      </TouchableOpacity>
      {/* 
      <Modal visible={isEditVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Update Title"
          />
          <TouchableOpacity onPress={() => setIsEditVisible(false)}>
            <Ionicons name="close-circle-outline" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </Modal> */}

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

          <TouchableOpacity style={styles.iconContainer} onPress={() => handleAddImage(item.id)}>
            <AntDesign name="upload"  size={50} color="white" />
            <Text style={styles.iconLabel}>Add Image</Text>
          </TouchableOpacity>





          <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteItem(item.id)}>
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  descriptionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  textArea: { flex: 2, minHeight: 100, borderWidth: 1, padding: 10, borderRadius: 8, height: 600, },
  date: { fontSize: 16, marginBottom: 10 },
  status: { fontSize: 16, color: 'green' },
  menuButton: { padding: 10 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  iconContainer: { alignItems: 'center', marginBottom: 20 },
  iconLabel: { color: 'white', fontSize: 16, marginTop: 8 },
  updateButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 20 },
  updateButtonText: { color: 'white', fontSize: 18 },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 5, width: '80%', marginBottom: 10 },
  submitButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, alignItems: 'center', width: '80%' },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1, // מאפשר לשדה הכותרת למלא את השטח
    marginRight: 10, // רווח מהכפתור
    borderBottomWidth: 1, // קו תחתון לדוגמה
    borderColor: '#ccc', // צבע קו תחתון
    padding: 5, // ריפוד
  },
  submitButtonText: { color: 'white', fontSize: 18 },
});

export default ListItemDetails;
