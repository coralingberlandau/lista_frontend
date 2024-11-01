import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Share } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { ColorPicker } from 'react-native-color-picker';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ListItem, RootStackParamList } from '../type';
import { StackNavigationProp } from '@react-navigation/stack';
import { HsvColor, hsvToHex } from 'react-color'; // או מהספרייה המתאימה
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
// import { show as showToast } from 'react-native-toast-message';

const AddListItem: React.FC<{ route: any }> = ({ route }) => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const { onGoBack } = route.params || {};
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string[]>(['']);
  const [images, setImages] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>('#fff');
  const [textColor, setTextColor] = useState<string>('#000');
  const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] = useState(false);
  const [isTextColorPickerVisible, setIsTextColorPickerVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  // const navigation = useNavigation();
  const { item }: { item: ListItem } = route.params;
  const [listItems, setListItems] = useState<ListItem[]>([]);

  // State for success message
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  // טוען את הצבעים השמורים מאחסון מקומי בעת טעינת הקומפוננטה

  useEffect(() => {
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

    loadColors();
  }, []);

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

        // צריך לבדוק למה זה<??????!!!
        // if (onGoBack) {
        //   onGoBack();
        // }

        // Show success message
        // setSuccessMessageVisible(true);
        Toast.show({
          type: 'success',
          text1: 'The list has been saved successfully!',
        });

        // Clear the text fields
        setTitle('');
        setDescription(['']);

        navigation.navigate('Home', { refresh: true });

        // מעבר לדף הבית לאחר הצגת הטוסטי פייל במשך 2 שניות
        // setTimeout(() => {
        //   navigation.navigate('Home', { refresh: true });
        // }, 2000); // התאם את הזמן לפי הצורך


        // Hide success message after 2 seconds
        // setTimeout(() => {
        //   setSuccessMessageVisible(false);
        //   navigation.navigate('Home', { refresh: true });
        // }, 3000);

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


  const handleAddDescriptionItem = () => {
    setDescription([...description, '']);
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


  //   const handleDeleteItem = async (itemId: number) => {
  //     try {
  //       await axios.patch(`http://127.0.0.1:8000/listitem/${itemId}/`, {
  //         is_active: false,
  //       });
  //        // הצגת טוסט מוצלח
  //        Toast.show({
  //         type: 'success',
  //         text1: 'The item has been deleted successfully!',
  //       });
  //       console.log('====================================');
  //       console.log('thisss isssss deletteeeeeeeee');
  //       console.log('====================================');
  //       // עדכון הרשימה בדף הבית על ידי סינון הפריט שהוסר
  //       setListItems((prevItemm) => prevItemm.filter(item => item.id !== itemId));
  //       // סגירת המודל וחזרה לדף הבית
  //       setIsMenuVisible(false);
  //       // חזרה לדף הבית
  //       navigation.navigate('Home', { refresh: true });
  //     } catch (error) {
  //        // טוסט לשגיאה
  //        Toast.show({
  //         type: 'error',
  //         text1:'Error deleting the item',
  //         text2: 'Please try again later',

  //       });
  //       console.error('Error updating item:', error, 'Item ID:', itemId);
  //     }
  // };

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

  const handleAddImage = (itemId: number) => {
    // כאן אתה יכול לכתוב את הלוגיקה להוספת תמונה
    console.log(`Add image to item with ID: ${itemId}`);
    // לדוגמה, תוכל לפתוח דיאלוג לבחור קובץ או מצלמה
};


  return (
    <View style={[styles.container, { backgroundColor }]}>
      {successMessageVisible && (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>The list has been saved successfully!</Text>
        </View> // Closing the View here
      )}

      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>New List</Text>
        <TouchableOpacity
          onPress={() => setIsMenuVisible(true)}
          style={styles.menuButton}
        >
          <Entypo name="dots-three-horizontal" size={35} color="black" />
        </TouchableOpacity>
      </View>


      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Title"
        placeholderTextColor={textColor}
        value={title}
        onChangeText={setTitle}
      />
      <FlatList
        data={description}
        renderItem={({ item, index }) => (
          <View style={styles.descriptionItem}>
            {/*             
            <TextInput
              style={[styles.input, { color: textColor, textDecorationLine: item.includes('✔️') ? 'line-through' : 'none' }]}
              placeholder="Description"
              placeholderTextColor={textColor}
              value={item}
              onChangeText={(text) => handleDescriptionChange(text, index)}
            /> */}

            {/* <TextInput
              style={[
                styles.textArea,
                { color: textColor, textDecorationLine: item.includes('✔️') ? 'line-through' : 'none' }
              ]}
              placeholder="Write here..."
              placeholderTextColor={textColor}
              multiline={true}
              value={item}
              onChangeText={(text) => handleDescriptionChange(text, index)}
            /> */}


            <TextInput
              style={[
                styles.textArea,
                //   { color: textColor, textDecorationLine: item.includes('✔️') ? 'line-through' : 'none', flex: 1, // מוסיף את האפשרות למלא את השטח
                //     minHeight: 100, // גובה מינימלי }
                // ]}
                {
                  color: textColor,
                  textDecorationLine: item.includes('✔️') ? 'line-through' : 'none',
                  flex: 2, // מוסיף את האפשרות למלא את השטח
                  minHeight: 100, // גובה מינימלי
                }
              ]}
              placeholder="Write here..."
              placeholderTextColor={textColor}
              multiline={true}
              value={item}
              onChangeText={(text) => handleDescriptionChange(text, index)}
            // מאפיינים נוספים כך שתיבת הטקסט תהיה גמישה ותמלא את כל המסך
            />

            <TouchableOpacity onPress={() => handleToggleItem(index)}>
              <FontAwesome name={item.includes('✔️') ? "check-square-o" : "square-o"} size={24} color={textColor} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      // ListFooterComponent={<TouchableOpacity onPress={handleAddDescriptionItem}><Ionicons name="add-circle" size={32} color={textColor} /></TouchableOpacity>}
      />
      {images.map((imageUri, index) => (
        <Image key={index} source={{ uri: imageUri }} style={styles.image} />
      ))}

      {/* תפריט מודאל */}
      <Modal visible={isMenuVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={handleAddDescriptionItem} style={styles.iconContainer}>
            <Ionicons name="list-circle-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Add List</Text>
          </TouchableOpacity>




          <TouchableOpacity onPress={() => setIsBackgroundPickerVisible(true)} style={styles.iconContainer}>
            <Ionicons name="color-palette-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Background</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsTextColorPickerVisible(true)} style={styles.iconContainer}>
            <Ionicons name="text-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Text Color</Text>
          </TouchableOpacity>

          {/* כאן יש להוסיף ColorPicker לבחירת צבע */}
          {/* {isBackgroundPickerVisible && (
            <ColorPicker onColorChange={handleBackgroundColorChange} />
          )}
          {isTextColorPickerVisible && (
            <ColorPicker onColorChange={handleTextColorChange} />
          )} */}

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




          <TouchableOpacity onPress={handleShare} style={styles.iconContainer}>
            <Ionicons name="share-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Share</Text>
          </TouchableOpacity>



          {/* <TouchableOpacity onPress={handleDeleteItem} style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteItem(item.id)}>
            <AntDesign name="delete" size={50} color="white" />
            <Text style={styles.iconLabel}>Delete</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.iconContainer} onPress={() => handleAddImage(item.id)}>
            <AntDesign name="upload"  size={50} color="white" />
            <Text style={styles.iconLabel}>Add Image</Text>
          </TouchableOpacity>




          <TouchableOpacity onPress={() => setIsMenuVisible(false)} style={styles.iconContainer}>
            <Ionicons name="close-circle-outline" size={50} color="white" />
            <Text style={styles.iconLabel}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal לבחירת צבע רקע *******************************/}
      <Modal visible={isBackgroundPickerVisible} transparent={true} animationType="slide">
        <View style={[styles.modalBackground, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
          <ColorPicker
            onColorSelected={handleBackgroundColorChange}
            style={styles.colorPicker}
          />
          <TouchableOpacity onPress={() => setIsBackgroundPickerVisible(false)}>
            <Ionicons name="close-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isTextColorPickerVisible} transparent={true} animationType="slide">
        <View style={[styles.modalBackground, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
          <ColorPicker
            onColorSelected={handleTextColorChange}
            style={styles.colorPicker}
          />
          <TouchableOpacity onPress={() => setIsTextColorPickerVisible(false)}>
            <Ionicons name="close-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity onPress={handleAddItem} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>


  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginBottom: 8,
  },
  descriptionItem: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start', // שיפוט מעלה
    justifyContent: 'space-between',
    marginBottom: 8,
    flex: 1, // גם כאן נוודא שהשורה תפוסה

  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 8,
    alignSelf: 'center',
  },
  menuButton: {
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  iconLabel: {
    color: 'white',
    marginTop: 5,
  },
  colorPicker: {
    height: 300,
    width: 300,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // textArea: {
  //   flex: 1,
  //   borderWidth: 1,
  //   borderColor: 'gray',
  //   padding: 10,
  //   borderRadius: 5,
  //   height: 200, // גודל המאפשר כתיבה נרחבת
  //   textAlignVertical: 'top',
  //   marginBottom: 8,
  // },
  textArea: {
    flex: 1,
    textAlignVertical: 'top',
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginBottom: 8,
    height: 600, // גודל המאפשר כתיבה נרחבת
  },
  // successMessage: {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: [{ translateX: -50 }, { translateY: -50 }],
  //   // backgroundColor: 'rgba(0, 255, 0, 0.8)', // Change this to your desired color
  //   backgroundColor: 'rgba(173, 216, 230, 0.8)', // Light blue with some transparency
  //   padding: 10,
  //   borderRadius: 5,
  //   zIndex: 1000,
  // },
  // successMessageText: {
  //   color: '#fff',
  //   fontSize: 16,
  //   textAlign: 'center',
  // },
  successMessage: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000, // לוודא שההודעה תופיע מעל כל אלמנט אחר
  },
  successMessageText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

export default AddListItem;