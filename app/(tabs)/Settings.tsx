import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Button, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';  // יש לוודא שאתה משתמש בזה
import { StackNavigationProp } from '@react-navigation/stack';
import { BackgroundImage, RootStackParamList } from '../type';  // קובץ שבו אתה מגדיר את המסכים
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { Image } from 'react-native';
import axios from 'axios';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import _ from 'lodash';


// טיפוס עבור פרופס של Settings
type SettingsProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
};

// טיפוס עבור הניווט למסך EditProfile
type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const Settings: React.FC<SettingsProps> = ({ setIsLoggedIn }) => {
  const appName = "Lista Application";
  const version = "1.0.0";
  const supportContact = "listaassistance@gmail.com";

  // שימוש ב-useNavigation עם טיפוס ספציפי
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  // פונקציה לדירוג האפליקציה
  const handleRateApp = () => {
    Linking.openURL('market://details?id=com.lista');  // חנות גוגל
  };

  // ניווט לעמוד עריכת פרופיל
  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile');  // ניווט למסך EditProfile
  };

  // פונקציה לפתיחת מייל
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${supportContact.split(': ')[1]}`);
  };

  // פונקציה להתנתקות
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsLoggedIn(false);  // מנתק את המשתמש על ידי עדכון הסטטוס ל-false
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({
        type: 'error',
        text1: 'Error logging out',
        text2: 'Please try again later',
      });
    }
  };


  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // אחסון התמונה שנבחרה
  const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] = useState(false); // מצב של תצוגת הבחירה
  const [selectedImage, setSelectedImage] = useState<number | null>(null); // אחסון התמונה שנבחרה
  const [isModalVisible, setIsModalVisible] = useState(false);



  // const storedUserId = AsyncStorage.getItem('userId')

  console.log('====================================');
  // console.log('ehhatttt idddddddd: ', storedUserId);
  console.log('====================================');


  const backgroundImages: BackgroundImage[] = [
    { id: 1, url: require('../../assets/background/back1.jpg') },
    { id: 2, url: require('../../assets/background/back2.jpg') },
    { id: 3, url: require('../../assets/background/back3.jpg') },
    { id: 4, url: require('../../assets/background/back4.jpg') },
    { id: 5, url: require('../../assets/background/back5.jpg') },
    { id: 6, url: require('../../assets/background/back6.jpg') },
    { id: 7, url: require('../../assets/background/back7.jpg') },
    { id: 8, url: require('../../assets/background/back8.jpg') },
    { id: 9, url: require('../../assets/background/back9.jpg') },
    { id: 10, url: require('../../assets/background/back10.jpg') },
    { id: 11, url: require('../../assets/background/back11.jpg') },
    { id: 12, url: require('../../assets/background/back12.jpg') },
    { id: 13, url: require('../../assets/background/back13.jpg') },
    { id: 15, url: require('../../assets/background/back14.jpg') },
    { id: 16, url: require('../../assets/background/back16.jpg') },
    { id: 17, url: require('../../assets/background/back17.jpg') },
    { id: 18, url: require('../../assets/background/back18.jpg') },
    { id: 19, url: require('../../assets/background/back19.jpg') },
    { id: 20, url: require('../../assets/background/back20.jpg') },
    { id: 21, url: require('../../assets/background/back21.jpg') },
    { id: 22, url: require('../../assets/background/back22.jpg') },
    { id: 23, url: require('../../assets/background/back23.jpg') },
    { id: 24, url: require('../../assets/background/back24.jpg') },
    { id: 25, url: require('../../assets/background/back25.jpg') },

  ];

  // הגדרת הפונקציה הדחויה (debounced)
const debounceSaveToServer = _.debounce(async (imageId: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `http://127.0.0.1:8000/customizations/`,
      {
        background_image_id: imageId || 0, // אם לא נשלח, השתמש ב-0 כערך ברירת מחדל
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (response.status === 200) {
      // שמירת התמונה ב-AsyncStorage
      await AsyncStorage.setItem('customizations', imageId.toString());
    }

    Toast.show({
      type: 'success',
      text1: 'Background changed successfully!',
    });
  } catch (error) {
    console.error('Error:', error);
    Toast.show({
      type: 'error',
      text1: 'An error occurred. Please try again later.',
    });
  }
}, 500);


// הפונקציה שמקבלת את ה-ID של התמונה ומבצע קריאה לפונקציה הדחויה
const handleBackgroundChange = async (imageId: number) => {
  setSelectedImage(imageId);
  debounceSaveToServer(imageId); // קריאה לפונקציה הדחויה
};




  // const handleBackgroundChange = async (imageId: number) => {
  //   setSelectedImage(imageId);

  //   // שמירת התמונה ב-AsyncStorage
  //   await AsyncStorage.setItem('backgroundImageId', imageId.toString());
  //   const token = await AsyncStorage.getItem('token');

  //   try {
  //     console.log("imageId:", imageId);

  //     const response = await axios.post(`http://127.0.0.1:8000/customizations/`, {
  //       background_image_id: imageId || 0,  // אם לא נשלח, משתמשים ב-"0" כערך ברירת מחדל
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.status === 200) {
  //       await AsyncStorage.setItem('customizations', imageId.toString()); // אם לא נשלח, משתמשים ב-"0" כערך ברירת מחדל
  //     }

  //     Toast.show({
  //       type: 'success',
  //       text1: 'Background changed successfully!',
  //     });

  //     console.log('Response:', response.data);
  //   }
  //   catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error('Axios error:', error.response?.data || error.message);

  //       Toast.show({
  //         type: 'error',
  //         text1: 'Server error.',
  //         text2: error.response?.data?.message || 'Please try again later.',
  //       });
  //     } else {
  //       const err = error as Error; // טיפול בשגיאה שאינה של Axios
  //       console.error('Unexpected error:', err.message);

  //       Toast.show({
  //         type: 'error',
  //         text1: 'Unexpected error occurred. Please try again later.',
  //       });
  //     }
    // }


  // };

  return (
    <ScrollView contentContainerStyle={styles.container}> {/* עטיפת כל התוכן ב-ScrollView */}

      {/* <View style={styles.container}> */}
      {/* <View style={styles.container}> */}


      <Text style={styles.title}>{appName}</Text>
      <Text style={styles.version}>Version: {version}</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <AntDesign name="logout" size={20} color="red" />
        <Text style={styles.iconLabelLogout}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Support</Text>
      <Text style={styles.supportInfo}>For assistance, please contact Lista support:</Text>
      <TouchableOpacity onPress={handleEmailPress}>
        <Text style={styles.supportContact}>{supportContact}</Text>
      </TouchableOpacity>
      <Text style={styles.notification}>If you need any assistance, feel free to reach out!</Text>
      <Text style={styles.inspirationText}>Keep achieving great things with Lista!</Text>
      <TouchableOpacity onPress={navigateToEditProfile} style={styles.editProfileButton}>
        <Ionicons name="pencil-outline" size={30} color="green" />
        <Text style={styles.iconLabel}>Edit Profile</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.touchable}> */}
        <Ionicons name="color-palette-outline" size={33} color="black" style={styles.icon} />
        {/* <Text style={[styles.iconLabel, styles.boldText]}>Background</Text> */}
        <Text style={[styles.iconLabel]}>Background</Text>
      {/* </TouchableOpacity> */}


      {/* הצגת התמונות לבחירה */}
      <View style={styles.backgroundPickerContainer}>

        {/* <FlatList
          data={backgroundImages} // מערך התמונות
          renderItem={({ item }: { item: BackgroundImage }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleBackgroundChange(item.id)}
              style={[
                styles.backgroundImageOption,
                { margin: 10 },
                selectedImage === item.id && { borderColor: 'blue', borderWidth: 2 },
              ]}
            >
              {/* <Image source={item.url} style={{ width: 100, height: 100 }} resizeMode="cover" /> */}

              {/* <Image source={item.url} style={styles.backgroundImage} resizeMode="cover" />



            </TouchableOpacity>
          )} */}
          {/* keyExtractor={(item) => item.id.toString()} // מזהה ייחודי לכל אובייקט */}
        {/* /> */} 



<FlatList
    data={backgroundImages} // מערך התמונות
    renderItem={({ item }: { item: BackgroundImage }) => (
      <TouchableOpacity
        onPress={() => handleBackgroundChange(item.id)}
        style={[
          styles.backgroundImageOption,
          { margin: 10 },
          selectedImage === item.id && { borderColor: 'blue', borderWidth: 2 },
        ]}
      >
        <Image
          source={item.url}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    )}
    keyExtractor={(item) => item.id.toString()} // מזהה ייחודי לכל אובייקט
    numColumns={3} // מספר התמונות בכל שורה
  />

        {/* 

          {backgroundImages.map((image) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => handleBackgroundChange(image.id)} // כאן 1 הוא ה- userId
              style={[
                styles.backgroundImageOption,
                selectedImage === image.id && styles.selectedBackgroundImage,
              ]}
            >
              <Image source={image.url} style={styles.backgroundImage} /> */}

        {/* <Image source={image.url} style={styles.backgroundImage} resizeMode="contain" /> */}

        {/* </TouchableOpacity>
          ))} */}




      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          © All rights reserved to Coral Landau, Founder of Lista.
        </Text>
      </View>
      {/* </View> */}
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexGrow: 1,  // מאפשר לגלול אם התוכן יותר גבוה מהמסך

    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#f5f5f5',
    position: 'relative',  // חשוב למיקום מוחלט של הכפתור




  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  version: {
    fontSize: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  settingOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  settingText: {
    fontSize: 18,
  },
  supportInfo: {
    fontSize: 16,
    marginVertical: 10,
  },
  supportContact: {
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  notification: {
    fontSize: 16,
    // color: 'green',
    // color: 'blue',
    marginVertical: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    // marginVertical: 20,
    // marginVertical: 15,

  },
  footerContainer: {
    alignItems: 'center',  // ממקם את הטקסט במרכז לרוחב
    paddingVertical: 20,
  },
  inspirationText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 15,
  },
  // logoutButton: {
  //   position: 'absolute', // למיקום בעמוד
  //   top: 20, // למקם למעלה (בקרבת שם המשתמש)
  //   right: 0, // למקם בצד ימין של המסך
  //   backgroundColor: '#f5f5f5',  // השתנה לצבע הרקע של הדף
  //   padding: 10, // להוסיף מרווחים
  //   borderRadius: 50, // עיגול מלא
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

  logoutButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,  // מרווחים
    borderRadius: 50,  // עיגול מלא
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',  // מיקום יחסית לפינה של המסך
    right: 0,  // למקם את הכפתור בצד ימין
    top: 0,  // למקם את הכפתור למעלה
    zIndex: 1,  // מוודא שהכפתור יהיה מעל כל רכיב אחר

  },

  iconLabel: {
    color: 'black',
    marginTop: 5,
    // marginTop: 10,
    fontSize: 16,

  },

  iconLabelLogout: {
    color: 'black',
    marginTop: 5,
    // marginTop: 10,
    fontSize: 14,


  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // צבע רקע אפור בהיר
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },

  backgroundPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,


  },

  backgroundImageOption: {
    margin: 5,
    // margin: 10,
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },


  backgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  touchable: {
    alignItems: 'center', // ממקם את כל התוכן במרכז
    marginVertical: 10, // רווח אנכי בין האלמנטים
    flexDirection: 'row', // הצגת התוכן בצורה אופקית (אייקון ליד טקסט)

  },

  boldText: {
    fontWeight: 'bold',
  },

  selectedBackgroundImage: {
    borderColor: 'blue', // צבע המסגרת שנראה כשהתמונה נבחרה
    borderWidth: 4,
  },

  icon: {
    marginRight: 10,
    // רווח קטן בין האייקון לכיתוב
  },

});

export default Settings;
