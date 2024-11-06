import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, FlatList, Button } from 'react-native';
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

import CheckBox from '@react-native-community/checkbox'; // עדכון הייבוא


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
  const [images, setImages] = useState<{ uri: string; text: string; size: number }[]>([]);

  const [backgroundColor, setBackgroundColor] = useState<string>('#fff');
  const [textColor, setTextColor] = useState<string>('#000');
  const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] = useState(false);
  const [isTextColorPickerVisible, setIsTextColorPickerVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [permissionType, setPermissionType] = useState('read_only'); // ברירת מחדל
  const [isReadOnlySelected, setIsReadOnlySelected] = useState(false);
  const [isFullAccessSelected, setIsFullAccessSelected] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('render', item?.id)
      setTitle(item?.title || '');
      setDescription(item?.description || ['']);
      // setImages([]); // Resetting the image on item change
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

// post griopulist - http://127.0.0.1:8000/grouplists/


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
          user: storedUserId,
          is_active: true,
          images,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("printttt", storedUserId)

        console.log('List item added:', response.data);


        // קבלת ה-ID של הפריט שנוצר
        const itemId = response.data.id;

        console.log('====================================');
        console.log("printttt", storedUserId, "idddddddddd", itemId);
        console.log('====================================');

          // לאחר הוספת הפריט, שמור את התמונות אם יש

        if (images.length > 0) {
          const itemId = response.data.id; // הנחה שהשרת מחזיר את ה-ID של הפריט החדש
          await axios.patch(`http://127.0.0.1:8000/listitem/${itemId}/`, {
            images: images, // כאן יש להניח שהשדה בשרת נקרא 'images'
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

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

  // const handleShare = async () => {
  //   console.log('tesstttt sher');
  //   try {
  //     await Share.share({
  //       message: `Title: ${title}\nDescription: ${description.join('\n')}`,
  //     });
  //   } catch (error) {
  //     console.error('Error sharing list item:', error);
  //   }
  // };


  // needddddddd -- shhhhaarreeeeeeeeeeeeeeeee

  const handleSharePress = () => {
    console.log('====================================');
    console.log('testttt sherrrrrreee');
    console.log('====================================');
    setIsModalVisible(true); // פותח את המודל
  };

  // משתף את הקישור עם הרשאה מתאימה
  // const handleShare = async () => {
  //   console.log('שיתוף ברשימה עם הרשאה:', permissionType);
  //   try {
  //     const link = `http://example.com/list/${item?.id}?permission=${permissionType}`;
  //     await Share.share({
  //       message: `Title: ${title}\nDescription: ${description.join('\n')}\nLink: ${link}`,
  //     });
  //   } catch (error) {
  //     console.error('שגיאה בשיתוף הפריט:', error);
  //   }
  // };

  const handlePermissionSelect = (type: any) => {
    if (type === 'read_only') {
      setIsReadOnlySelected(true);
      setIsFullAccessSelected(false);
      setPermissionType('read_only');
    } else if (type === 'full_access') {
      setIsReadOnlySelected(false);
      setIsFullAccessSelected(true);
      setPermissionType('full_access');
    }
  };

  // / מבצע את השיתוף בפועל ושומר את הפרטים בבסיס הנתונים/
  const handleConfirmShare = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');

    if (storedUserId && token) {
      const data = {
        user: { id: storedUserId, username: 'your_username', password: 'your_password' }, // כאן יש לספק את שם המשתמש והסיסמה
        list_item: item?.id,
        role: 'member', // ברירת מחדל
        permission_type: permissionType,
      };

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/grouplists/',
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Sending data:', data);
        console.log('Response from server:', response.data);

        // שיתוף הקישור לאחר שמירת הנתונים
        await Share.share({
          message: `Title: ${title}\nDescription: ${description.join('\n')}`,
        });

        // הודעת הצלחה
        Toast.show({
          type: 'success',
          text1: 'List shared successfully!',
        });
      } catch (error: any) {
        console.error('Error sharing list item:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        Toast.show({
          type: 'error',
          text1: 'Error sharing the list. Please try again later.',
        });
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


  // needddddddd -- shhhhaarreeeeeeeeeeeeeeeee

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

  // itemId: number)

  const handleAddImage = async (itemId: number) => {
    console.log('====================================');
    console.log({ itemId }, "teessttt for imaggeeeeeee");
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
      const selectedImages = result.assets.map((image: ImagePicker.ImageInfo) => ({
        uri: image.uri,
        text: '', // טקסט התחלתי ריק
        size: 100, // גובה התמונה ברירת מחדל
      }));
      setImages((prevImages) => [...prevImages, ...selectedImages]);


      console.log(`נבחרו ${selectedImages.length} תמונות עבור פריט ID: ${itemId}`);

      // כאן הוסף את הקוד להוספת התמונות לשרת
      try {
        await axios.patch(`http://127.0.0.1:8000/listitem/${itemId}/`, {
          images: selectedImages // כאן יש להניח שהשדה בשרת נקרא 'images'
        });
        Toast.show({
          type: 'success',
          text1: 'התמונות נוספו בהצלחה!',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'שגיאה בהוספת התמונות',
          text2: 'נא לנסות שוב מאוחר יותר',
        });
        console.error('Error adding images:', error);
      }
    }
  };

  




  //imaaggeeeeeeeeeeeee -- imaaggeeeeeeeeeeeee ******************** $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

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
        type: 'error',
        text1: 'Error deleting the item',
        text2: 'Please try again later',
      });
      console.error('Error updating item:', error, 'Item ID:', itemId);
    }
  };

  const handleUpdateList = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8000/listitem/${item.id}/`, {
        title,
        description,
        image: images, // השתנה ל-'image' כי זה השם במסד הנתונים שלך
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




      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: 10 }}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: item.size, height: item.size }} // כאן תשתמש בגודל של התמונה
            />
            <TextInput
              value={item.text}
              onChangeText={(text) => {
                const newImages = [...images];
                newImages[index].text = text; // עדכון הטקסט
                setImages(newImages);
              }}
              placeholder="כתוב משהו על התמונה"
              style={{ borderWidth: 1, marginVertical: 5 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  const newImages = [...images];
                  newImages[index].size = Math.max(newImages[index].size - 10, 20); // הקטנת הגובה ב-10
                  setImages(newImages);
                }}
              >
                <Ionicons name="remove" size={24} color="black" /> {/* אייקון מינוס */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const newImages = [...images];
                  newImages[index].size += 10; // הגדלת הגובה ב-10
                  setImages(newImages);
                }}
              >
                <Ionicons name="add" size={24} color="black" /> {/* אייקון פלוס */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const newImages = images.filter((_, imgIndex) => imgIndex !== index); // מחיקת התמונה
                  setImages(newImages);
                }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="trash" size={24} color="red" /> {/* אייקון פח */}
              </TouchableOpacity>
            </View>
          </View>
        )}
        numColumns={3} // כדי ליצור תצוגה רשתית
      />

































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

          <TouchableOpacity style={styles.iconContainer} onPress={handleSharePress}>
            <Ionicons name="share-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Share</Text>
          </TouchableOpacity>




          {/* תפריטט של השיתוףף */}

          {isModalVisible && (
            <View style={styles.modalContainer}>
              <Text>Select Permission:</Text>
              <TouchableOpacity onPress={() => handlePermissionSelect('read_only')}>
                <Text style={{ color: isReadOnlySelected ? 'blue' : 'black' }}>Read Only</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePermissionSelect('full_access')}>
                <Text style={{ color: isFullAccessSelected ? 'blue' : 'black' }}>Full Access</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmShare}>
                <Text>Confirm Share</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={{ color: 'red' }}>Close</Text>
              </TouchableOpacity>
            </View>
          )}



          {/* immaaaggeeeeeeeeee ??????????????????/ */}


          <TouchableOpacity style={styles.iconContainer} onPress={() => handleAddImage(item?.id)}>
            <AntDesign name="upload" size={50} color="white" />
            <Text style={styles.iconLabel}>Add Image</Text>
          </TouchableOpacity>

          {/* iff i need thiss ??????????????????/ */}
          {/* 
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={{ width: 100, height: 100, margin: 5 }} />
            ))}
          </View> */}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // modalContainer: {
  //   width: 300,
  //   padding: 20,
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   alignItems: 'center',
  // },
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
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





});

export default ListItemDetails;