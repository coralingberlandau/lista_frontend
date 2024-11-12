import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, FlatList, Button } from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { ListItem, RootStackParamList, User } from './type';
import { Ionicons, AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Share } from 'react-native';
import { HsvColor, hsvToHex } from 'react-color'; // או מהספרייה המתאימה
import * as ImagePicker from 'expo-image-picker';
import { ColorPicker } from 'react-native-color-picker';
import { Picker } from '@react-native-picker/picker'; // Import Picker component
import Slider from '@react-native-community/slider';


type ListItemDetailsRouteProp = RouteProp<RootStackParamList, 'ListItemDetails'>;

const ListItemDetails: React.FC = () => {
  const route = useRoute<ListItemDetailsRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const { listItem }: { listItem?: ListItem } = route.params || {};

  const isUpdateMode = !!listItem
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [title, setTitle] = useState(listItem ? listItem.title : '');
  const [items, setItems] = useState<string[]>(listItem ? listItem.items.split("|") : ['']);
  const [permission, setPermission] = useState('read_only');
  const [shareValue, setShareValue] = useState('');


  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  console.log(title, listItem, items)

  const [images, setImages] = useState<Image[]>([]);


  const [backgroundColor, setBackgroundColor] = useState<string>('#fff');
  const [textColor, setTextColor] = useState<string>('#000');

  const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] = useState(false);
  const [isTextColorPickerVisible, setIsTextColorPickerVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [largeImage, setLargeImage] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);


  useFocusEffect(
    useCallback(() => {
      console.log('render', listItem?.id)
      setTitle(listItem?.title || '');
      setItems(listItem?.items.split("|") || ['']);
      // setImages([]); // Resetting the image on item change
      loadColors();
    }, [listItem])
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

  // post griopulist - http://127.0.0.1:8000/grouplists/

  const handleAddItem = async () => {
    console.log('====================================');
    console.log('testttt loooggggg');
    console.log('====================================');
    const storedUserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');

    if (storedUserId && token) {
      try {
        const itemsToString = items.join("|");
        const response = await axios.post(`http://127.0.0.1:8000/listitem/`, {
          title,
          items: itemsToString,
          user: storedUserId,
          is_active: true,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("printttt", storedUserId)
        console.log('List item added:', response.data);
        const itemId = response.data.id;

        console.log('====================================');
        console.log("printttt", storedUserId, "idddddddddd", itemId);
        console.log('====================================');

        // לאחר הוספת הפריט, שמור את התמונות אם יש

        // if (images.length > 0) {
        //   const itemId = response.data.id; // הנחה שהשרת מחזיר את ה-ID של הפריט החדש
        //   await axios.patch(`http://127.0.0.1:8000/listitem/${itemId}/`, {
        //     images: images, // כאן יש להניח שהשדה בשרת נקרא 'images'
        //   }, {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   });
        // }

        // לאחר הוספת הפריט, שמור את התמונות אם יש
        //  if (images.length > 0) {
        //   await handleAddImage(itemId, images, token); // העבר את ה-itemId כאן
        // }

        // יצירת רשומה חדשה ב-GroupList
        await axios.post(`http://127.0.0.1:8000/grouplists/`, {
          user: storedUserId,
          list_item: itemId,
          role: 'admin', // הגדר תפקיד התחלתי, למשל "admin" ליוצר הרשימה
          permission_type: 'full_access', // הרשאות גישה מלאות ליוצר הרשימה
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Toast.show({
          type: 'success',
          text1: 'The list has been saved successfully!',
        });

        setImages([]);  // ל

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
    setItems(prev => [...prev, '']);
  };

  const handleItemChange = (text: string, index: number) => {
    const newItems = [...items];
    newItems[index] = text;
    setItems(newItems);
  };

  const handleToggleItem = (index: number) => {
    const newItems = [...items];
    const itemText = newItems[index];
    if (itemText.startsWith('✔️ ')) {
      newItems[index] = itemText.replace('✔️ ', ''); // Remove check mark
    } else {
      newItems[index] = `✔️ ${itemText}`; // Add check mark
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSharePress = () => {
    console.log('====================================');
    console.log('testttt sherrrrrreee');
    console.log('====================================');
    setIsModalVisible(true); // פותח את המודל
  };

  const handlePermissionSelect = (selectedPermission: string) => {
    setPermission(selectedPermission);
  };

  const handleConfirmShare = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');

    if (storedUserId && token) {
      try {
        const userResponse: { data: User } = await axios.get(`http://127.0.0.1:8000/get_user_info/${shareValue}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(userResponse, userResponse.data.id)
        await axios.post(`http://127.0.0.1:8000/grouplists/`, {
          user: userResponse.data.id,
          list_item: listItem?.id,
          role: 'member', // הגדר תפקיד התחלתי, למשל "admin" ליוצר הרשימה
          permission_type: permission, // הרשאות גישה מלאות ליוצר הרשימה
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Toast.show({
          type: 'success',
          text1: 'List shared successfully!',
        });
      } catch (error: any) {
        console.error('Error sharing list item:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        if (error.status === 404) {
          Toast.show({
            type: 'error',
            text1: 'User not found. Please verify the email',
          });
        }
        else {
          Toast.show({
            type: 'error',
            text1: 'Error sharing the list. Please try again later.',
          });
        }

      } finally {
        setIsModalVisible(false);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'User ID or token not found. Please log in again.',
      });
    }
  };

  // colorrrrr************* -- colooooooorrrrrrrrrrrrrrr ********************


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

  // colorrrrr************* -- colooooooorrrrrrrrrrrrrrr ********************

  //imaaggeeeeeeeeeeeee -- imaaggeeeeeeeeeeeee ******************** $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  const handleShowLargeImage = (imageUrl: any) => {
    setLargeImage(imageUrl); // שמירת ה-URL של התמונה כדי להציג אותה במודאל
    setModalVisible(true); // הצגת המודאל
  };

  const handleCloseLargeImage = () => {
    setModalVisible(false); // הסתרת המודאל
    setLargeImage(null); // איפוס ה-URL של התמונה
  };

  //imaaggeeeeeeeeeeeee -- imaaggeeeeeeeeeeeee ******************** $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // *********************************************************** 

  const handleDeleteItem = async (itemId: number) => {
    const storedUserId = await AsyncStorage.getItem('userId');
    console.log('====================================');
    console.log(itemId);
    console.log(listItem.id);
    console.log('====================================');
    try {
      const token = await AsyncStorage.getItem('token');  // קבלת הטוקן מ-AsyncStorage
      if (!token) {
        console.error("User is not logged in!");
        return;
      }

      const response = await axios.patch(
        `http://127.0.0.1:8000/listitem/${listItem.id}/`,
        { is_active: false },
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // הוספת הטוקן לכותרת Authorization
          },
        }
      );

      console.log("Item successfully deleted!");

      // הצגת הודעת הצלחה
      Toast.show({
        type: 'success',
        text1: 'The item has been deleted successfully!',
      });

      setIsMenuVisible(false);
      navigation.navigate('Home');
    } catch (error: unknown) {
      // טיפול בשגיאה בצורה מדויקת
      if (axios.isAxiosError(error)) {
        // אם זו שגיאת Axios, הצג את הודעת השגיאה
        console.error("Error deleting item:", error.response ? error.response.data : error.message);
      } else {
        // במקרה של שגיאה אחרת
        console.error("Unexpected error:", error);
      }

      Toast.show({
        type: 'error',
        text1: 'Error deleting the item',
        text2: 'Please try again later',
      });
    }
  }

  // פונקציה לעדכון רשימה
  const handleUpdateList = async () => {
    const itemsToString = items.join("|");
    try {
      const token = await AsyncStorage.getItem('token');  // קבלת הטוקן מ-AsyncStorage
      if (!token) {
        console.error("User is not logged in!");
        return;
      }

      await axios.patch(
        `http://127.0.0.1:8000/listitem/${listItem.id}/`,
        { title, items: itemsToString },
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // הוספת הטוקן לכותרת Authorization
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'The list has been updated successfully!',
      });

      navigation.navigate('Home');
    } catch (error: unknown) {
      // טיפול בשגיאה בצורה מדויקת
      if (axios.isAxiosError(error)) {
        // אם זו שגיאת Axios, הצג את הודעת השגיאה
        console.error("Error updating list:", error.response ? error.response.data : error.message);
      } else {
        // במקרה של שגיאה אחרת
        console.error("Unexpected error:", error);
      }
      Toast.show({
        type: 'error',
        text1: 'Error updating the item',
        text2: 'Please try again later',
      });
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
        data={items}
        renderItem={({ item, index }) => (
          <View style={styles.item}>


            <TouchableOpacity onPress={() => handleToggleItem(index)} style={{ marginRight: 10 }}>
              <FontAwesome name={item.includes('✔️') ? "check-square-o" : "square-o"} size={24} />
            </TouchableOpacity>


            {/* אם יש תמונה, נציג אותה בקטן */}
            {listItem && listItem.image ? (
              <TouchableOpacity onPress={() => handleShowLargeImage(listItem.image)} style={{ marginRight: 10 }}>
                <Image source={{ uri: listItem.image }} style={{ width: 40, height: 40, borderRadius: 5 }} />
              </TouchableOpacity>
            ) : (
              // אם אין תמונה, נציג את האייקון של "העלאה"
              <TouchableOpacity onPress={() => handleAddImage(index)} style={{ marginRight: 10 }}>
                <FontAwesome name="image" size={20} color="blue" />
              </TouchableOpacity>
            )}


            {/* כפתור מחיקה */}
            <TouchableOpacity onPress={() => handleRemoveItem(index)} style={{ marginRight: 10 }}>
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
              onChangeText={(text) => handleItemChange(text, index)}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()} />
      {selectedImage && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseLargeImage}>
              <Text style={{ color: 'white', fontSize: 18 }}>X</Text>
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.largeImage} />
          </View>
        </Modal>
      )}



      <TouchableOpacity style={styles.addItemButton} onPress={AddItemToList}>
        <Text style={styles.addItemButtonText}>Add Item</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.updateButton} onPress={isUpdateMode ? handleUpdateList : handleAddItem}>
        <Text style={styles.updateButtonText}>{isUpdateMode ? 'Update List' : "Create List"}</Text>
      </TouchableOpacity>

      <Modal visible={isMenuVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>

          {/* iff i need thiss ???????????????/ */}


          {/* <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="list-circle-outline" size={50} color="white" />
          <Text style={styles.iconLabel}>Add List</Text>
        </TouchableOpacity> */}

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

          {/* <TouchableOpacity style={styles.iconContainer} onPress={() => handleShare()}>
            <Ionicons name="share-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Share</Text>
          </TouchableOpacity> */}

          {isUpdateMode && <TouchableOpacity style={styles.iconContainer} onPress={handleSharePress}>
            <Ionicons name="share-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Share</Text>
          </TouchableOpacity>}

          {/* תפריטט של השיתוףף */}

          {isModalVisible && (
            <View style={styles.modalContainer}>
              <Text>Select Permission:</Text>

              {/* Dropdown for permissions */}
              <Picker
                selectedValue={permission}
                onValueChange={handlePermissionSelect}
                style={{ height: 50, width: 200 }}
              >
                <Picker.Item label="Read Only" value="read_only" />
                <Picker.Item label="Full Access" value="full_access" />
              </Picker>

              {/* Text Input for custom value */}
              <TextInput
                placeholder="Enter a value"
                value={shareValue}
                onChangeText={setShareValue}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
              />

              {/* Confirm Share Button */}
              <TouchableOpacity onPress={handleConfirmShare}>
                <Text>Confirm Share</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={{ color: 'red' }}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* immaaaggeeeeeeeeee ??????????????????/ */}

          {/* <TouchableOpacity style={styles.iconContainer} onPress={() => handleAddImage(item?.id)}>
            <AntDesign name="upload" size={50} color="white" />
            <Text style={styles.iconLabel}>Add Image</Text>
          </TouchableOpacity> */}

          {isUpdateMode && <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteItem(listItem.id)}>
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
  item: {
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
    backgroundColor: "#39B8D4",
    // backgroundColor: "#A3D9FF",
    // backgroundColor: "#80D4FF",
    // backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',  // מרכז את הכפתור בתוך המיכל
    marginVertical: 20,
    width: '80%',  // הכפתור יתפוס 80% מהמסך, לא משנה גודלו

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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  permissionOption: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 10,
  },
  cancelButton: {
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  largeImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 20,
  },
});

export default ListItemDetails;