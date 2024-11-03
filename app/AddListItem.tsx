// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { Share } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import * as DocumentPicker from 'expo-document-picker';
// import { ColorPicker } from 'react-native-color-picker';
// import { Entypo } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { ListItem, RootStackParamList } from './type';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { HsvColor, hsvToHex } from 'react-color'; // או מהספרייה המתאימה
// import Slider from '@react-native-community/slider';
// import Toast from 'react-native-toast-message';
// import * as ImagePicker from 'expo-image-picker';

// const AddListItem: React.FC<{ route: any }> = ({ route }) => {

//   const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

//   const { onGoBack } = route.params || {};
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string[]>(['']);
//   const [images, setImages] = useState<string[]>([]);
//   const [backgroundColor, setBackgroundColor] = useState<string>('#fff');
//   const [textColor, setTextColor] = useState<string>('#000');
//   const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] = useState(false);
//   const [isTextColorPickerVisible, setIsTextColorPickerVisible] = useState(false);
//   const [isMenuVisible, setIsMenuVisible] = useState(false);
//   const { item }: { item: ListItem } = route.params;
//   const [listItems, setListItems] = useState<ListItem[]>([]);

//   // useEffect(() => {
//   //   const loadColors = async () => {
//   //     const savedBackgroundColor = await AsyncStorage.getItem('backgroundColor');
//   //     const savedTextColor = await AsyncStorage.getItem('textColor');

//   //     if (savedBackgroundColor) {
//   //       setBackgroundColor(savedBackgroundColor);
//   //     }
//   //     if (savedTextColor) {
//   //       setTextColor(savedTextColor);
//   //     }
//   //   };
//   //   loadColors();
//   // }, []);

//   // const handleAddItem = async () => {
//   //   console.log('====================================');
//   //   console.log('testttt loooggggg');
//   //   console.log('====================================');
//   //   const storedUserId = await AsyncStorage.getItem('userId');
//   //   const token = await AsyncStorage.getItem('token');

//   //   if (storedUserId && token) {
//   //     try {
//   //       const response = await axios.post(`http://127.0.0.1:8000/listitem/`, {
//   //         title,
//   //         description,
//   //         user_id: storedUserId,
//   //         is_active: true,
//   //         images,
//   //       }, {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       });

//   //       console.log('List item added:', response.data);

//   //       Toast.show({
//   //         type: 'success',
//   //         text1: 'The list has been saved successfully!',
//   //       });

//   //       // Clear the text fields
//   //       setTitle('');
//   //       setDescription(['']);

//   //       navigation.navigate('Home', { refresh: true });

//   //     } catch (error) {
//   //       console.error('Error adding list item:', error);
//   //       Toast.show({
//   //         type: 'error',
//   //         text1: 'Error adding the item',
//   //         text2: 'Please try again later',
//   //       });
//   //     }
//   //   };
//   // };

//   const handleAddDescriptionItem = () => {
//     setDescription([...description, '']);
//   };

//   const handleDescriptionChange = (text: string, index: number) => {
//     const newDescription = [...description];
//     newDescription[index] = text;
//     setDescription(newDescription);
//   };

//   const handleToggleItem = (index: number) => {
//     const newDescription = [...description];
//     const itemIndex = newDescription[index].indexOf('✔️');
//     newDescription[index] = itemIndex > -1 ? newDescription[index].replace('✔️', '') : `✔️ ${newDescription[index]}`;
//     setDescription(newDescription);
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `Title: ${title}\nDescription: ${description.join('\n')}`,
//       });
//     } catch (error) {
//       console.error('Error sharing list item:', error);
//     }
//   };

//   const handleTextColorChange = async (color: HsvColor | string) => {
//     const colorHex = typeof color === 'string' ? color : hsvToHex(color.h, color.s, color.v);
//     setTextColor(colorHex);
//     await AsyncStorage.setItem('textColor', colorHex); // שמירה באמצעות AsyncStorage
//     setIsTextColorPickerVisible(false);
//   };

//   const handleBackgroundColorChange = async (color: HsvColor | string) => {
//     const colorHex = typeof color === 'string' ? color : hsvToHex(color.h, color.s, color.v);
//     setBackgroundColor(colorHex);
//     await AsyncStorage.setItem('backgroundColor', colorHex); // שמירה באמצעות AsyncStorage
//     setIsBackgroundPickerVisible(false);
//   };

//   const handleAddImage = async (itemId: number) => {
//     // בקשה להרשאות (מצלמה/גלריה)
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permissionResult.granted) {
//       alert("Permission to access the gallery is required!");
//       return;
//     }
//     // פתיחת גלריה ובחירת תמונה
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true, // אופציה לבחירה מרובה, תלוי בתמיכה במערכת ההפעלה
//       quality: 1,
//     });

//     if (!result.canceled) {
//       // הוספת התמונות שנבחרו לרשימה
//       // setImages((prevImages) => [...prevImages, result.uri]);
//     }
//   };

//   const handleRemoveItem = (index: number) => {
//     const newDescription = [...description];
//     newDescription.splice(index, 1);
//     setDescription(newDescription);
//   };

//   return (
//     <View style={[styles.container, { backgroundColor }]}>
//       <View style={styles.header}>
//         <TextInput
//           style={[styles.titleInput, { outline: 'none' }]}
//           placeholder="Title"
//           placeholderTextColor={textColor}
//           value={title}
//           onChangeText={setTitle}
//         />
//         <TouchableOpacity
//           onPress={() => setIsMenuVisible(true)}
//           style={styles.menuButton}
//         >
//           <Entypo name="dots-three-horizontal" size={35} color="black" />
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         data={description}
//         renderItem={({ item, index }) => (
//           <View style={styles.descriptionItem}>
//             <TouchableOpacity onPress={() => handleToggleItem(index)}>
//               <FontAwesome name={item.includes('✔️') ? "check-square-o" : "square-o"} size={24} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleRemoveItem(index)} style={{ marginLeft: 15 }}>
//               <AntDesign name="delete" size={20} color="red" />
//             </TouchableOpacity>
//             <TextInput
//               style={[
//                 styles.textArea,
//                 {
//                   outline: 'none',
//                   textDecorationLine: item.includes('✔️') ? 'line-through' : 'none',
//                 },
//               ]}
//               placeholder="Write here..."
//               multiline={false}  // Set to false for a single line
//               value={item}
//               onChangeText={(text) => handleDescriptionChange(text, index)}
//             />
//           </View>
//         )}
//         keyExtractor={(_, index) => index.toString()}
//       />
//       {/* תפריט מודאל */}
//       <Modal visible={isMenuVisible} transparent={true} animationType="slide">
//         <View style={styles.modalBackground}>
//           <TouchableOpacity onPress={handleAddDescriptionItem} style={styles.iconContainer}>
//             <Ionicons name="list-circle-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Add List</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => setIsBackgroundPickerVisible(true)} style={styles.iconContainer}>
//             <Ionicons name="color-palette-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Background</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setIsTextColorPickerVisible(true)} style={styles.iconContainer}>
//             <Ionicons name="text-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Text Color</Text>
//           </TouchableOpacity>

//           {/* כאן יש להוסיף ColorPicker לבחירת צבע */}
//           {isBackgroundPickerVisible && (
//             <ColorPicker
//               onColorChange={handleBackgroundColorChange}
//               sliderComponent={Slider as any}
//             />
//           )}
//           {isTextColorPickerVisible && (
//             <ColorPicker
//               onColorChange={handleTextColorChange}
//               sliderComponent={Slider as any}
//             />
//           )}


//           <TouchableOpacity onPress={handleShare} style={styles.iconContainer}>
//             <Ionicons name="share-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Share</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.iconContainer} onPress={() => handleAddImage(item.id)}>
//             <AntDesign name="upload" size={50} color="white" />
//             <Text style={styles.iconLabel}>Add Image</Text>
//           </TouchableOpacity>

//           <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
//             {images.map((uri, index) => (
//               <Image key={index} source={{ uri }} style={{ width: 100, height: 100, margin: 5 }} />
//             ))}
//           </View>
//           <TouchableOpacity onPress={() => setIsMenuVisible(false)} style={styles.iconContainer}>
//             <Ionicons name="close-circle-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       {/* Modal לבחירת צבע רקע *******************************/}
//       <Modal visible={isBackgroundPickerVisible} transparent={true} animationType="slide">
//         <View style={[styles.modalBackground, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
//           <ColorPicker
//             onColorSelected={handleBackgroundColorChange}
//             style={styles.colorPicker}
//           />
//           <TouchableOpacity onPress={() => setIsBackgroundPickerVisible(false)}>
//             <Ionicons name="close-circle-outline" size={40} color="black" />
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       <Modal visible={isTextColorPickerVisible} transparent={true} animationType="slide">
//         <View style={[styles.modalBackground, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
//           <ColorPicker
//             onColorSelected={handleTextColorChange}
//             style={styles.colorPicker}
//           />
//           <TouchableOpacity onPress={() => setIsTextColorPickerVisible(false)}>
//             <Ionicons name="close-circle-outline" size={40} color="black" />
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       <TouchableOpacity onPress={handleAddItem} style={styles.submitButton}>
//         <Text style={styles.submitButtonText}>Submit</Text>
//       </TouchableOpacity>
//     </View >
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   titleInput: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     flex: 1,
//     marginRight: 10,
//     padding: 5,
//   },
//   descriptionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   textArea: {
//     flex: 2,
//     borderWidth: 0,
//     paddingLeft: 10,
//     fontSize: 18,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     marginVertical: 8,
//     alignSelf: 'center',
//   },
//   menuButton: {
//     padding: 10,
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   iconContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 10,
//   },
//   iconLabel: {
//     color: 'white',
//     marginTop: 5,
//   },
//   colorPicker: {
//     height: 300,
//     width: 300,
//   },
//   submitButton: {
//     backgroundColor: 'blue',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default AddListItem;