import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, FlatList, ImageBackground, useWindowDimensions, Button, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { ImageData, ListItem, ListItemImage, RootStackParamList, User } from './type';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [largeImage, setLargeImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [backgroundImageId, setBackgroundImageId] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const [recommendations, setRecommendations] = useState([]); // שמירה על ההמלצות
  const [loading, setLoading] = useState(false); // מצב טעינה
  const [updatedImagesIndex, setUpdatedImagesIndex] = useState<string[]>([])
  const [deletedImagesIndex, setDeletedImagesIndex] = useState<string[]>([])


  const [error, setError] = useState<string | null>(null);

  const [permissionType, setPermissionType] = useState<string | null>(null);


  console.log('images', images)

  console.log('permissionType', permissionType);



  useFocusEffect(
    useCallback(() => {
      setTitle(listItem?.title || '');
      setItems(listItem?.items.split("|") || ['']);
      setUpdatedImagesIndex([])
      setDeletedImagesIndex([])
      getImages()
      getBackgroundImage()

      fetchPermissionType();
    }, [listItem])
  );


  // uppdatataaaaa premissssannn!!!!!!!

  // הפונקציה שמבצעת את קריאת ה-API ומעדכנת את הסטייט של ה-permission_type
  const fetchPermissionType = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');


    if (!storedUserId || !listItem?.id) {
      setError('Missing user_id or list_item_id');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://127.0.0.1:8000/grouplists/permission_type/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          user_id: storedUserId,
          list_item_id: listItem?.id,
        }
      });

      setPermissionType(response.data.permission_type);
    } catch (err) {
      console.error('Error fetching permission type:', err);
      setError('Failed to fetch permission type');
    } finally {
      setLoading(false);
    }
  };


  // הפונקציה שמבצעת את שאר העדכונים, כמו title, items, וכו'
  // const updateListItemDetails = useCallback(() => {
  //   setTitle(listItem?.title || '');
  //   setItems(listItem?.items.split("|") || ['']);
  //   setUpdatedImagesIndex([]);
  //   setDeletedImagesIndex([]);
  //   getImages();
  //   getBackgroundImage();
  // }, [listItem]);

  // // שימוש ב-useFocusEffect כדי לבצע את כל הפעולות כל פעם שהמסך מקבל פוקוס
  // useFocusEffect(
  //   useCallback(() => {
  //     updateListItemDetails();
  //     fetchPermissionType(); // קריאה לפונקציה שמביאה את ה-permission_type

  //     // הפונקציה הזו תתבצע כל פעם שהמסך מקבל פוקוס, כלומר כל פעם שהמשתמש חוזר למסך הזה
  //   }, [listItem])
  //   // [listItem, user_id, listItem]
  // );


  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  // uppdatataaaaa premissssannn!!!!!!!


  const fetchRecommendations = async () => {
    console.log('====================================');
    console.log('woerrkkkk aiiii');
    console.log('====================================');
    //   if (!listItem || !listItem.id) {
    //     console.error('Item ID is not available');
    //     return;
    //   }

    //   setLoading(true);
    //   try {
    //     const data = await getRecommendations(listItem.id);
    //     if (data && data.recommended_items) {
    //       setRecommendations(data.recommended_items.split(','));
    //       console.log('Recommendations data:', data);

    //     }
    //   } catch (error) {
    //     console.error('Error fetching recommendations:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // const getRecommendations = async (listItemId: number) => {
    //   try {
    //     const response = await axios.get(`http://127.0.0.1:8000/recommendations/${listItemId}/`)
    //     if (response.status !== 200) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const data = await response.data;
    //     return data;
    //   } catch (error) {
    //     console.error('Error fetching recommendations:', error);
    //   }
  };


  const handleAddItem = async () => {
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

        console.log('List item added:', response.data);
        const itemId = response.data.id;

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
      newItems[index] = itemText.replace('✔️ ', '');
    } else {
      newItems[index] = `✔️ ${itemText}`;
    }
    setItems(newItems);
  };

  const handleRemoveImages = (index: number, imageToRemove: ImageData) => {
    setDeletedImagesIndex(prev => [...prev, imageToRemove.index.toString()])
    const newImages = images.filter((image) => image.index !== index)
    setImages(newImages);
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    images.forEach((image) => {
      if (image.index > index) {
        const imgeIndex = image.index
        setUpdatedImagesIndex(prev => [...prev, imgeIndex.toString()])
        image.index--
      }
    })
    const imageToRemove = images.filter((image: ImageData) => image.index === index)
    if(imageToRemove && imageToRemove.length > 0){
      handleRemoveImages(index, imageToRemove[0])
    }
  };


  const handleSharePress = () => {
    if (permissionType === 'read_only') {
      Toast.show({
        type: 'error',
        text1: 'You do not have permission to share this list.',
      });
      return;
    }
    setIsModalVisible(true);
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

  const getImages = async () => {
    try {
      if (listItem?.id) {
        const response = await axios.get(
          `http://127.0.0.1:8000/listitemimages/${listItem.id}/get_images_for_list_item/`
        );

        if (response.status === 200 && Array.isArray(response.data.images)) {
          console.log('response', response.data.images)
          const formattedImages = response.data.images.map((image: any) => {
            const imageUrl = image.url.startsWith("http")
              ? image.url
              : `http://127.0.0.1:8000${image.url}`;
            return {
              id: image.id || 0,
              uri: imageUrl || "",
              fileName: image.fileName || "unknown.jpg",
              mimeType: image.mimeType || "image/jpeg",
              index: image.index,
            };
          });
          setImages(formattedImages);
        } else {
          console.error("Invalid response format:", response.data);
          setImages([]);
        }
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    }
  };

  const getBackgroundImage = async () => {
    const backgroundId = await AsyncStorage.getItem('customizations');
    setBackgroundImageId(backgroundId)
  };

  const handleDeleteItem = async (itemId: number) => {
    if (permissionType === 'read_only') {
      Toast.show({
        type: 'error',
        text1: 'You do not have permission to delete this item.',
      });
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("User is not logged in!");
        return;
      }

      const response = await axios.patch(
        `http://127.0.0.1:8000/listitem/${listItem.id}/`,
        { is_active: false },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'The item has been deleted successfully!',
      });

      setIsMenuVisible(false);
      navigation.navigate('Home');

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting item:", error.response ? error.response.data : error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      Toast.show({
        type: 'error',
        text1: 'Error deleting the item',
        text2: 'Please try again later',
      });
    }
  }

  const handleUpdateList = async () => {
    const itemsToString = items.join("|");
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("User is not logged in!");
        return;
      }

      await axios.patch(
        `http://127.0.0.1:8000/listitem/${listItem.id}/`,
        { title, items: itemsToString },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
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

      if (axios.isAxiosError(error)) {
        console.error("Error updating list:", error.response ? error.response.data : error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      Toast.show({
        type: 'error',
        text1: 'Error updating the item',
        text2: 'Please try again later',
      });
    }
  };

  const handleAddImage = async (index: number) => {
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

    if (isUpdateMode && (deletedImagesIndex.length > 0 || updatedImagesIndex.length > 0)) {
      try {
        console.log({ deletedImagesIndex, updatedImagesIndex })
        await axios.post('http://127.0.0.1:8000/listitemimages/update_images/',
          {
            list_item_id: listItem.id,
            deletedImagesIndex: deletedImagesIndex,
            updatedImagesIndex: updatedImagesIndex
          }, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      catch { }
    }

    const formData = new FormData();
    formData.append('list_item', listItemId.toString());

    for (const image of images) {
      if (image.fileName === 'unknown.jpg') {
        continue
      }

      const base64Image = image.uri.split(',')[1];

      formData.append('images', JSON.stringify({
        uri: base64Image,
        fileName: image.fileName,
        mimeType: image.mimeType,
        index: image.index
      }));
    }

    if (formData.has('images')) {
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
    }
  };

  const handleShowLargeImage = (index: number) => {
    const selectedImage = images.find((img) => img.index === index);
    if (selectedImage) {
      setLargeImage(selectedImage.uri);
      setModalVisible(true);
      console.log('Images fetched:', images);
      console.log("Large Image URI:", largeImage);

    } else {
      console.error("Image not found for index:", index);
    }
  };

  const handleCloseLargeImage = () => {
    setModalVisible(false);
  };

  const fetchListItemImages = async (listItemId: number, index?: number) => {
    try {
      const url = index !== undefined
        ? `http://127.0.0.1:8000/listitemimages/${listItemId}/get_images_for_list_item/?index=${index}`
        : `http://127.0.0.1:8000/listitemimages/${listItemId}/get_images_for_list_item/`;

      const response = await axios.get(url);

      if (response.status === 200 && Array.isArray(response.data.images)) {
        const formattedImages = response.data.images.map((image: any) => ({
          uri: image.uri || image.url,
          id: image.id || null,
        }));

        setImages(formattedImages);
      } else {
        console.error("Invalid response format", response.data);
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


  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: `../assets/background/back${backgroundImageId}.jpg` }}
        style={[styles.background, { width, height }]} // מתאימים את התמונה לגודל המסך
        resizeMode="cover">
        <ScrollView contentContainerStyle={styles.container}> {/* עטיפת כל התוכן ב-ScrollView */}
          <View style={styles.header}>
            <TextInput
              style={[styles.titleInput, { outline: 'none' }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Edit Title" />
          </View>
          <FlatList
            data={items}
            renderItem={({ item, index }) => {
              const filterImage = images && images.filter((img) => img.index === index)
              console.log(filterImage, 'filterImage')
              return (
                <View style={styles.item}>
                  <TouchableOpacity onPress={() => handleToggleItem(index)} style={{ marginRight: 10 }}>
                    <FontAwesome name={item.includes('✔️') ? "check-square-o" : "square-o"} size={25} />
                  </TouchableOpacity>

                  {filterImage.length > 0 ? (
                    <TouchableOpacity
                      key={filterImage[0].id}
                      onPress={() => handleShowLargeImage(index)}

                      style={{ marginRight: 10 }}
                    >
                      <Image
                        source={{ uri: filterImage[0].uri }}
                        style={{ width: 25, height: 25, borderRadius: 5 }} // הגדלה של התמונה כדי שתהיה ברורה יותר
                        onError={() => console.error("Failed to load image")}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleAddImage(index)} style={{ marginRight: 10 }}>
                      <FontAwesome name="image" size={25} color="blue" />
                    </TouchableOpacity>
                  )}

                  <Modal
                    visible={modalVisible}
                    onRequestClose={handleCloseLargeImage}
                    animationType="fade"
                    transparent={true}
                  >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                      <View style={styles.seeImage}>
                        <TouchableOpacity onPress={handleCloseLargeImage}>
                          {largeImage ? (
                            <Image
                              source={{ uri: largeImage }}
                              style={{
                                width: width * 0.9,
                                height: height * 0.7,
                                borderRadius: 10,
                                resizeMode: 'contain',
                              }}
                              onError={() => console.error('Failed to load large image')}
                            />
                          ) : (
                            <Text>Image not available</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                  <TouchableOpacity onPress={() => handleRemoveItem(index)} style={{ marginRight: 10 }}>
                    <AntDesign name="delete" size={25} color="red" />
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
                    multiline={false}
                    value={item}
                    onChangeText={(text) => handleItemChange(text, index)}
                  />
                </View>
              )

            }}
            keyExtractor={(_, index) => index.toString()} />



          {/* <View style={styles.iconRowContainer}>
            {isUpdateMode && <TouchableOpacity style={styles.iconContainer} onPress={handleSharePress}>
              <Ionicons name="share-outline" size={25} color="black" />
              <Text style={styles.iconLabel}>Share</Text>
            </TouchableOpacity>}

            {isModalVisible && (
              <View style={styles.overlay}>

                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Select Permission</Text>

                  {/* Dropdown for permissions */}
          {/* <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={permission}
                      onValueChange={handlePermissionSelect}
                      style={styles.picker}
                    >
                      <Picker.Item label="Read Only" value="read_only" />
                      <Picker.Item label="Full Access" value="full_access" />
                    </Picker>
                  </View>
                  <TextInput
                    placeholder="Enter a email"
                    value={shareValue}
                    onChangeText={setShareValue}
                    style={styles.input}
                  />
                  <TouchableOpacity style={styles.confirmButton} onPress={() => {
                    handleConfirmShare();
                    setShareValue('');
                  }}>
                    <Text style={styles.confirmButtonText}>Confirm Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeButtonShare} onPress={() => {
                    setShareValue('');
                    setIsModalVisible(false);
                  }}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}-


            {isUpdateMode && <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteItem(listItem.id)}>
              <AntDesign name="delete" size={25} color="black" />
              <Text style={styles.iconLabel}>Delete</Text>
            </TouchableOpacity>}  */}


          <View style={styles.iconRowContainer}>

          {isUpdateMode && <TouchableOpacity style={styles.iconContainer} onPress={fetchRecommendations}>
              <FontAwesome5 name="lightbulb" size={25} color="purple" />
              <Text style={styles.iconLabel}>AI</Text>
            </TouchableOpacity>}
          {/* </View> */}



          {/* ai!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}



          {/* {isUpdateMode && <Button title="Get Recommendations" onPress={fetchRecommendations} />} */}
          {/* <FontAwesome name="lightbulb-o" size={25} color="purple" /> */}
          {/* <FontAwesome name="magic" size={25} color="purple" />  */}

          {/* {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View>
              <Text>Recommendations:</Text>  */}

          {/* הצגת ההמלצות */}

          {/* <FlatList
                data={recommendations} // הצגת ההמלצות
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Text>{item}</Text>
                  </View>
                )}
              />
            </View>
          )}  */}

            {isUpdateMode && permissionType === 'full_access' && (
              <TouchableOpacity style={styles.iconContainer} onPress={handleSharePress}>
                <Ionicons name="share-outline" size={25} color="black" />
                <Text style={styles.iconLabel}>Share</Text>
              </TouchableOpacity>
            )}

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
                  <TextInput
                    placeholder="Enter a email"
                    value={shareValue}
                    onChangeText={setShareValue}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => {
                      handleConfirmShare();
                      setShareValue('');
                    }}
                  >
                    <Text style={styles.confirmButtonText}>Confirm Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeButtonShare}
                    onPress={() => {
                      setShareValue('');
                      setIsModalVisible(false);
                    }}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isUpdateMode && permissionType === 'full_access' && (
              <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteItem(listItem.id)}>
                <AntDesign name="delete" size={25} color="black" />
                <Text style={styles.iconLabel}>Delete</Text>
              </TouchableOpacity>
            )}






          </View>


        {/* ai!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}



          <TouchableOpacity style={styles.addItemButton} onPress={AddItemToList}>
            <Text style={styles.addItemButtonText}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.updateButton} onPress={isUpdateMode ? handleUpdateList : handleAddItem}>
            <Text style={styles.updateButtonText}>{isUpdateMode ? 'Update List' : "Create List"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View >

  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titleInput: {
    width: '90%',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    padding: 5,
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textArea: {
    flex: 2,
    borderWidth: 0,
    paddingLeft: 10,
    fontSize: 18,
  },
  addItemButton: {
    backgroundColor: "#39B8D4",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    width: '80%',

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
  // modalBackground: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
  // },

  // modalTitle: {

  // },
  modalTitle: {
    marginBottom: 15,
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // permissionOption: {
  //   fontSize: 18,
  //   color: '#fff',
  //   marginVertical: 10,
  // },
  // cancelButton: {
  //   fontSize: 18,
  //   color: 'red',
  //   marginTop: 20,
  // },
  // optionContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 15,
  // },
  // checkbox: {
  //   marginRight: 10,
  // },
  // optionText: {
  //   fontSize: 16,
  // },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    marginBottom: 10,
  },

  // shareButton: {
  //   backgroundColor: '#4CAF50',
  //   padding: 10,
  //   borderRadius: 8,
  // },
  // shareButtonText: {
  //   color: '#fff',
  //   fontSize: 16,
  // },


  // modalContainerSh: {
  //   position: 'absolute', 
  //   top: '50%',
  //   left: '50%',
  //   transform: [{ translateX: -100 }, { translateY: -100 }], 
  //   width: 200, 
  //   padding: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.8,
  //   shadowRadius: 2,
  //   elevation: 5,
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  // largeImage: {
  //   width: 300,
  //   height: 300,
  //   borderRadius: 10,
  // },

  iconRowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    paddingHorizontal: 10,
    marginTop: 10,
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 1,
  },
  iconContainer: {
    flexDirection: 'column', // האייקון והטקסט יישארו אחד מעל השני
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconLabel: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',

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
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 10,
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
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  seeImage: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ListItemDetails;
