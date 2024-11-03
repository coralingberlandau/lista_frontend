import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, FlatList } from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { ListItem, RootStackParamList } from './type';
import { Ionicons, AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Share } from 'react-native';
import { HsvColor, hsvToHex } from 'react-color'; // או מהספרייה המתאימה
import * as ImagePicker from 'expo-image-picker';
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

type ListItemDetailsRouteProp = RouteProp<RootStackParamList, 'ListItemDetails'>;

const ListItemDetails: React.FC = () => {
  const route = useRoute<ListItemDetailsRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const { item }: { item?: ListItem } = route.params || {};
  const isUpdateMode = !!item
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [title, setTitle] = useState(item ? item.title : '');
  const [description, setDescription] = useState<string[]>(item ? item.description : ['']);

  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  console.log(title, item, description)
  const [images, setImages] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>('#fff');
  const [textColor, setTextColor] = useState<string>('#000');
  const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] = useState(false);
  const [isTextColorPickerVisible, setIsTextColorPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('render')
      setTitle(item?.title || '');
      setDescription(item?.description || ['']);
      loadColors();
    }, [item])
  );

  const loadColors = async () => {
    const savedBackgroundColor = await AsyncStorage.getItem('backgroundColor');
    const savedTextColor = await AsyncStorage.getItem('textColor');

    if (savedBackgroundColor) {
      setBackgroundColor(savedBackgroundColor);
    }
    if (savedTextColor) {
      setTextColor(savedTextColor);
    }
  };

  const handleAddItem = async () => {
    console.log('====================================');
    console.log('testttt loooggggg');
    console.log('====================================');
    const storedUserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');

    if (storedUserId && token) {
      try {
        const response = await axios.post(`http://127.0.0.1:8000/listitem/`, {
          title,
          description,
          user_id: storedUserId,
          is_active: true,
          images,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('List item added:', response.data);

        Toast.show({
          type: 'success',
          text1: 'The list has been saved successfully!',
        });

        // Clear the text fields
        // setTitle('');
        // setDescription(['']);

        navigation.navigate('Home');

      } catch (error) {
        console.error('Error adding list item:', error);
        Toast.show({
          type: 'error',
          text1: 'Error adding the item',
          text2: 'Please try again later',
        });
      }
    };
  };

  const AddItemToList = () => {
    setDescription(prev => [...prev, '']);
  };

  const handleDescriptionChange = (text: string, index: number) => {
    const newDescription = [...description];
    newDescription[index] = text;
    setDescription(newDescription);
  };

  const handleToggleItem = (index: number) => {
    const newDescription = [...description];
    // Toggle check mark logic
    const itemText = newDescription[index];
    if (itemText.startsWith('✔️ ')) {
      newDescription[index] = itemText.replace('✔️ ', ''); // Remove check mark
    } else {
      newDescription[index] = `✔️ ${itemText}`; // Add check mark
    }
    setDescription(newDescription);
  };

  const handleRemoveItem = (index: number) => {
    const newDescription = [...description];
    newDescription.splice(index, 1);
    setDescription(newDescription);
  };

  // needddddddd

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Title: ${title}\nDescription: ${description.join('\n')}`,
      });
    } catch (error) {
      console.error('Error sharing list item:', error);
    }
  };


  const handleTextColorChange = async (color: HsvColor | string) => {
    const colorHex = typeof color === 'string' ? color : hsvToHex(color.h, color.s, color.v);
    setTextColor(colorHex);
    await AsyncStorage.setItem('textColor', colorHex); // שמירה באמצעות AsyncStorage
    setIsTextColorPickerVisible(false);
  };

  const handleBackgroundColorChange = async (color: HsvColor | string) => {
    const colorHex = typeof color === 'string' ? color : hsvToHex(color.h, color.s, color.v);
    setBackgroundColor(colorHex);
    await AsyncStorage.setItem('backgroundColor', colorHex); // שמירה באמצעות AsyncStorage
    setIsBackgroundPickerVisible(false);
  };

// *********************************************************** 

  const handleDeleteItem = async (itemId: number) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/listitem/${itemId}/`, {
        is_active: false,
      });
      Toast.show({
        type: 'success',
        text1: 'The item has been deleted successfully!',
      });
      setIsMenuVisible(false);
      navigation.navigate('Home');
    } catch (error) {
      Toast.show({
        type:'error',
        text1:'Error deleting the item',
        text2:'Please try again later',
      });
      console.error('Error updating item:', error, 'Item ID:', itemId);
    }
  };

  const handleUpdateList = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8000/listitem/${item.id}/`, {
        title,
        description,
      });
      Toast.show({
        type: 'success',
        text1: 'The list has been updated successfully!',
      });
      navigation.navigate('Home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating the item',
        text2: 'Please try again later',
      });
      console.error('Error updating list:', error);
    }
  };

  const handleAddImage = async (itemId: number) => {
    console.log('====================================');
    console.log({itemId}, "teessttt for imaggeeeeeee");
    console.log('====================================');
    // בקשת הרשאה לגלריה
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      alert("נדרשת הרשאה לגשת לגלריה!");
      return;
    }
  
    // פתיחת גלריה לבחירת תמונה
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // אופציה לבחירה מרובה (אם נתמך)
      quality: 1,
    });
  
    if (!result.canceled && result.assets) {
      // הגדרה מפורשת של סוג התמונות במערך
      const selectedImages = result.assets.map((image: ImagePicker.ImageInfo) => image.uri);
  
      // הוספת התמונות שנבחרו למערך התמונות
      // setImages((prevImages) => [...prevImages, ...selectedImages]);
      
      console.log(`נבחרו ${selectedImages.length} תמונות עבור פריט ID: ${itemId}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={[styles.titleInput, { outline: 'none' }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Edit Title"
        />
        <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
          <Entypo name="dots-three-horizontal" size={35} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={description}
        renderItem={({ item, index }) => (
          <View style={styles.descriptionItem}>
            <TouchableOpacity onPress={() => handleToggleItem(index)}>
              <FontAwesome name={item.includes('✔️') ? "check-square-o" : "square-o"} size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveItem(index)} style={{ marginLeft: 15 }}>
              <AntDesign name="delete" size={20} color="red" />
            </TouchableOpacity>
            <TextInput
              style={[
                styles.textArea,
                {
                  outline: 'none',
                  textDecorationLine: item.includes('✔️') ? 'line-through' : 'none',
                },
              ]}
              placeholder="Write here..."
              multiline={false}  // Set to false for a single line
              value={item}
              onChangeText={(text) => handleDescriptionChange(text, index)}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <TouchableOpacity style={styles.addItemButton} onPress={AddItemToList}>
        <Text style={styles.addItemButtonText}>Add Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateButton} onPress={ isUpdateMode ? handleUpdateList : handleAddItem }>
        <Text style={styles.updateButtonText}>{isUpdateMode ? 'Update List' : "Create List"}</Text>
      </TouchableOpacity>

{/* iff i need thiss ???????????????/ */}
      <Modal visible={isMenuVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="list-circle-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Add List</Text>
          </TouchableOpacity>

      {/* iff i need thiss ??????????????????/ */}

          <TouchableOpacity onPress={() => setIsBackgroundPickerVisible(true)} style={styles.iconContainer}>
            <Ionicons name="color-palette-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Background</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsTextColorPickerVisible(true)} style={styles.iconContainer}>
            <Ionicons name="text-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Text Color</Text>
          </TouchableOpacity>

          {/* כאן יש להוסיף ColorPicker לבחירת צבע */}
          {isBackgroundPickerVisible && (
            <ColorPicker
              onColorChange={handleBackgroundColorChange}
              sliderComponent={Slider as any}
            />
          )}
          {isTextColorPickerVisible && (
            <ColorPicker
              onColorChange={handleTextColorChange}
              sliderComponent={Slider as any}
            />
          )}
          <TouchableOpacity style={styles.iconContainer} onPress={() => handleShare()}>
            <Ionicons name="share-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Share</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.iconContainer} onPress={() => handleAddImage(item.id)}>
            <AntDesign name="upload" size={50} color="white" />
            <Text style={styles.iconLabel}>Add Image</Text>
          </TouchableOpacity>

      {/* iff i need thiss ??????????????????/ */}

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={{ width: 100, height: 100, margin: 5 }} />
            ))}
          </View>
                {/* iff i need thiss ??????????????????/ */}
          {isUpdateMode && <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteItem(item.id)}>
            <AntDesign name="delete" size={50} color="white" />
            <Text style={styles.iconLabel}>Delete</Text>
          </TouchableOpacity>}
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
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    padding: 5,
  },
  descriptionItem: {
    flexDirection: 'row',
    alignItems: 'center', // Center icons with text input
    marginBottom: 10,
  },
  textArea: {
    flex: 2,
    borderWidth: 0, // No border
    paddingLeft: 10,
    fontSize: 18,
  },
  addItemButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  addItemButtonText: {
    color: 'white',
    fontSize: 18,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconLabel: {
    color: 'white',
    marginTop: 5,
  },
});

export default ListItemDetails;