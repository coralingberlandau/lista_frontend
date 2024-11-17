import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, FlatList, ImageBackground, Dimensions } from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { ImageData, ListItem, ListItemImage, RootStackParamList, User } from './type';
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
import { ScrollView } from 'react-native-gesture-handler';


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


  // לבדוקקקקק
  const { width, height } = Dimensions.get('window'); // קבלת גודל המסך



  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [largeImage, setLargeImage] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [images, setImages] = useState<ImageData[]>([]);

  const [backgroundImageId, setBackgroundImageId] = useState<string | null>(null);


  console.log(title, listItem, items, images)



  const getImages = async () => {
    if(listItem?.id) {
      const response = await axios.get(`http://127.0.0.1:8000/listitemimages/${listItem.id}/get_images_for_list_item/`);
      setImages(response.data.images)
    }
    else {
      setImages([])
    }
  };

  const getBackgroundImage = async () => {
    const backgroundId = await AsyncStorage.getItem('customizations');
    setBackgroundImageId(backgroundId)
  };

  useFocusEffect(
    useCallback(() => {
      console.log('render', listItem?.id)
      setTitle(listItem?.title || '');
      setItems(listItem?.items.split("|") || ['']);
      getImages()
      getBackgroundImage()
    }, [listItem])
  );

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

        const response1 = await axios.post(`http://127.0.0.1:8000/grouplists/`, {
          user: storedUserId,
          list_item: itemId,
          role: 'admin', // הגדר תפקיד התחלתי, למשל "admin" ליוצר הרשימה
          permission_type: 'full_access', // הרשאות גישה מלאות ליוצר הרשימה
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response2 = await handleSaveImages(itemId)

        Toast.show({
          type: 'success',
          text1: 'The list has been saved successfully!',
        });

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

      await handleSaveImages(listItem.id)

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


  {/* תמונווווווווותתתתתתתתתת !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */ }


  const handleAddImage = async (index: number) => {
    console.log("Image index: ", index);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    console.log('result images', result);

    if (!result.canceled && result.assets) {
      const newImage: ImageData = {
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName || `image_${index}.jpeg`,
        mimeType: result.assets[0].type || 'image/jpeg',
        index: index,
      };

      setImages([...images, newImage]);
    }
  };



  const handleSaveImages = async (listItemId: number) => {
    console.log('images', images);

    const formData = new FormData();
    formData.append('list_item',  listItemId.toString());

    for (const image of images) {
      const base64Image = image.uri.split(',')[1];  // הסרת המידע המיותר מ-URI של base64

      // הוספת המידע המפוקסל כ-Base64
      formData.append('images', JSON.stringify({
        uri: base64Image,  // הוספת התמונה ב-Base64
        fileName: image.fileName,
        mimeType: image.mimeType,
        index: image.index
      }));
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/listitemimages/upload_images/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('response', response);
      return response.data;
    } catch (error) {
      console.error('Error uploading images', error);
    }
  };




  //imaaggeeeeeeeeeeeee -- imaaggeeeeeeeeeeeee ******************** $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


  // פונקציות להגדלת תמונה ולסגירת המודאל


  const handleShowLargeImage = (imageUrl: any) => {
    setLargeImage(imageUrl); // שמירת ה-URL של התמונה כדי להציג אותה במודאל
    setModalVisible(true); // הצגת המודאל
  };

  const handleCloseLargeImage = () => {
    setModalVisible(false); // הסתרת המודאל
    setLargeImage(null); // איפוס ה-URL של התמונה
  };



  // שליפת תמונות מהדאטהבייס



  const fetchListItemImages = async (listItemId: number, index?: number) => {
    try {
      const url = index !== undefined
        ? `http://127.0.0.1:8000/listitemimages/${listItemId}/get_images_for_list_item/?index=${index}`
        : `http://127.0.0.1:8000/listitemimages/${listItemId}/get_images_for_list_item/`;

      const response = await axios.get(url);

      if (response.status === 200) {
        setImages(response.data.images); // שמירת התמונות בסטייט
      }
    } catch (error) {
      console.error("Error fetching images", error);
    }
  };



  const renderItem = ({ item, index }: { item: ListItemImage, index: number }) => (
    <TouchableOpacity onPress={() => handleAddImage(index)} style={{ marginRight: 10 }}>
      <Image source={{ uri: item.uri }} style={{ width: 40, height: 40, borderRadius: 5 }} />
    </TouchableOpacity>
  );


  const ListEmptyComponent = () => (
    <TouchableOpacity onPress={() => handleAddImage(0)} style={{ marginRight: 10 }}>
      <FontAwesome name="image" size={20} color="blue" />
    </TouchableOpacity>
  );




  //imaaggeeeeeeeeeeeee -- imaaggeeeeeeeeeeeee ******************** $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$




  return (
    <ImageBackground

    source={{ uri: `../assets/background/back${backgroundImageId}.jpg` }} 

      // source={{ uri: `../assets/background/back14.jpg` }} // or require('./path-to-local-image.jpg')



      style={[styles.background, { width, height }]} // מתאימים את התמונה לגודל המסך
      // resizeMode="stretch" // Try "contain" or "stretch" if needed
      resizeMode="cover" // התמונה תתממשק עם המסך ותחסה אותו כל הזמן
    >


    <ScrollView contentContainerStyle={styles.container}> {/* עטיפת כל התוכן ב-ScrollView */}

   
      {/* <View style={styles.container}> */}
        <View style={styles.header}>
          <TextInput
            style={[styles.titleInput, { outline: 'none' }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Edit Title"
          />


          {/* כפתורררר שלוש נקודותתת */}
          {/* <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
            <Entypo name="dots-three-horizontal" size={35} color="black" />
          </TouchableOpacity> */}

          {/* כפתורררר שלוש נקודותתת */}




        </View>
        <FlatList
          data={items}
          renderItem={({ item, index }) => {
            const filterImage = images && images.filter((img) => img.index === index)
            return (
              <View style={styles.item}>
                <TouchableOpacity onPress={() => handleToggleItem(index)} style={{ marginRight: 10 }}>
                  <FontAwesome name={item.includes('✔️') ? "check-square-o" : "square-o"} size={24} />
                </TouchableOpacity>
                {filterImage.length > 0 ? 
                  <TouchableOpacity onPress={() => fetchListItemImages(index)} style={{ marginRight: 10 }}>
                    <Image
                        source={{ uri: filterImage[0].uri }}
                        style={{ width: 40, height: 40, borderRadius: 5 }}
                      />
                  </TouchableOpacity>
                : 
                  <TouchableOpacity onPress={() => handleAddImage(index)} style={{ marginRight: 10 }}>
                    <FontAwesome name="image" size={40} color="blue" />
                  </TouchableOpacity>
                }
                <Modal visible={modalVisible} transparent={true}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <TouchableOpacity onPress={handleCloseLargeImage} style={{ position: 'absolute', top: 20, right: 20 }}>
                      <FontAwesome name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <Image source={{ uri: largeImage }} style={{ width: '80%', height: '80%', resizeMode: 'contain' }} />
                  </View>
                </Modal>
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
            )

          }}
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




        {/* // מודל להצגת תמונה בגדול */}

        {isModalVisible && (
          <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: modalImage }}
                style={styles.largeImage}
              />
            </View>
          </Modal>
        )}















        <View style={styles.iconRowContainer}>
          {isUpdateMode && <TouchableOpacity style={styles.iconContainer} onPress={handleSharePress}>
            <Ionicons name="share-outline" size={25} color="black" />
            <Text style={styles.iconLabel}>Share</Text>
          </TouchableOpacity>}

          {isModalVisible && (
            <View style={styles.overlay}>

              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Permission</Text>

                {/* Dropdown for permissions */}
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={permission}
                    onValueChange={handlePermissionSelect}
                    style={styles.picker}
                  >
                    <Picker.Item label="Read Only" value="read_only" />
                    <Picker.Item label="Full Access" value="full_access" />
                  </Picker>
                </View>
                {/* Text Input for custom value */}
                <TextInput
                  placeholder="Enter a email"
                  value={shareValue}
                  onChangeText={setShareValue}
                  style={styles.input}
                />
                {/* Confirm Share Button */}
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmShare}>
                  <Text style={styles.confirmButtonText}>Confirm Share</Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity style={styles.closeButtonShare} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>

            </View>

          )}

          {isUpdateMode && <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteItem(listItem.id)}>
            <AntDesign name="delete" size={25} color="black" />
            <Text style={styles.iconLabel}>Delete</Text>
          </TouchableOpacity>}
        </View>



        <TouchableOpacity style={styles.addItemButton} onPress={AddItemToList}>
          <Text style={styles.addItemButtonText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={isUpdateMode ? handleUpdateList : handleAddItem}>
          <Text style={styles.updateButtonText}>{isUpdateMode ? 'Update List' : "Create List"}</Text>
        </TouchableOpacity>






        {/* <Modal visible={isMenuVisible} transparent={true} animationType="slide">
          <View style={styles.modalBackground}> 
            <TouchableOpacity onPress={() => setIsMenuVisible(false)} style={styles.iconContainer}>
              <Ionicons name="close-circle-outline" size={50} color="white" />
              <Text style={styles.iconLabel}>Close</Text>
            </TouchableOpacity> 

        </View>
        </Modal> */}


      {/* </View> */}
      </ScrollView>
    </ImageBackground>
   

  );
};


{/* immaaaggeeeeeeeeee ??????????????????/ */ }

{/* <TouchableOpacity style={styles.iconContainer} onPress={() => handleAddImage(item?.id)}>
            <AntDesign name="upload" size={50} color="white" />
            <Text style={styles.iconLabel}>Add Image</Text>
          </TouchableOpacity> */}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // שכבה כהה שקופה

  },
  container: { flex: 1, padding: 20 },
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
  // iconContainer: {
  //   alignItems: 'center',
  // //   marginVertical: 20,
  // },
  // iconLabel: {
  //   color: 'white',
  //   marginTop: 5,
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
  shareButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  // modalOverlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   justifyContent: 'center',
  // //   alignItems: 'center',
  // },


  modalContainerSh: {
    position: 'absolute', // שומר את המיקום במרכז
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }], // ממקם את המודל בדיוק במרכז המסך
    width: 200, // רוחב המודל
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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

  iconRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // מיישר את האייקונים לימין
    position: 'absolute', // מיקום אבסולוטי כדי למקם את הקונטיינר למעלה
    paddingHorizontal: 10,
    marginTop: 10,
    top: 0, // מצמיד את הקונטיינר לחלק העליון
    right: 0, // מצמיד את הקונטיינר לימין
    padding: 10,
    zIndex: 1, // מבטיח שהאייקונים יהיו מ
  },
  iconContainer: {
    alignItems: 'center',
    marginHorizontal: 10, // רווח בין האייקונים
  },
  iconLabel: {
    fontSize: 12,
    color: 'black',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 20,
    fontWeight: 'bold',
  },





  closeButtonShare: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
  },


  overlay: {
    position: 'fixed', // מבטיח שהמודאל תמיד יצוף על פני הדף, גם בעת גלילה
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // רקע כהה חצי שקוף
    display: 'flex', // מאפשר גמישות במיקום התוכן
    justifyContent: 'center', // ממקם את התוכן במרכז אופקי
    alignItems: 'center', // ממקם את התוכן במרכז אנכי
    zIndex: 1, // מבטיח שהמודאל יהיה מעל לכל התוכן
  }



});

export default ListItemDetails;