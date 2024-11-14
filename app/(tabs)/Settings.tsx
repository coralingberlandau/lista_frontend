import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';  // יש לוודא שאתה משתמש בזה
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../type';  // קובץ שבו אתה מגדיר את המסכים
import { AntDesign, Ionicons } from '@expo/vector-icons';

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




   // colorrrrr************* -- colooooooorrrrrrrrrrrrrrr ********************

  //  const [backgroundColor, setBackgroundColor] = useState<string>('#fff');
  //  const [textColor, setTextColor] = useState<string>('#000');
 
  //  const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] = useState(false);
  //  const [isTextColorPickerVisible, setIsTextColorPickerVisible] = useState(false);


  //  const loadColors = async () => {
  //   const savedBackgroundColor = await AsyncStorage.getItem('backgroundColor');
  //   const savedTextColor = await AsyncStorage.getItem('textColor');

  //   if (savedBackgroundColor) {
  //     setBackgroundColor(savedBackgroundColor);
  //   }
  //   if (savedTextColor) {
  //     setTextColor(savedTextColor);
  //   }
  // };

  //  const handleTextColorChange = async (color: HsvColor | string) => {
  //   const colorHex = typeof color === 'string' ? color : hsvToHex(color.h, color.s, color.v);
  //   setTextColor(colorHex);
  //   await AsyncStorage.setItem('textColor', colorHex); // שמירה באמצעות AsyncStorage
  //   setIsTextColorPickerVisible(false);
  // };

  // const handleBackgroundColorChange = async (color: HsvColor | string) => {
  //   const colorHex = typeof color === 'string' ? color : hsvToHex(color.h, color.s, color.v);
  //   setBackgroundColor(colorHex);
  //   await AsyncStorage.setItem('backgroundColor', colorHex); // שמירה באמצעות AsyncStorage
  //   setIsBackgroundPickerVisible(false);
  // };

  // colorrrrr************* -- colooooooorrrrrrrrrrrrrrr ********************

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{appName}</Text>
      <Text style={styles.version}>Version: {version}</Text>


      {/* <Button title="Logout" onPress={handleLogout} /> */}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <AntDesign name="logout" size={20} color="red" />
        <Text style={styles.iconLabel}>Logout</Text>
      </TouchableOpacity>




      {/* wwwhhhaaaaaattttttt */}
      {/* <Text style={styles.sectionTitle}>General Settings</Text>
      <TouchableOpacity style={styles.settingOption} onPress={() => { }}>
        <Text style={styles.settingText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingOption} onPress={() => { }}>
        <Text style={styles.settingText}>Theme</Text>
      </TouchableOpacity> */}

      {/* wwwhhhaaaaaattttttt */}





      <Text style={styles.sectionTitle}>Support</Text>
      <Text style={styles.supportInfo}>For assistance, please contact Lista support:</Text>
      <TouchableOpacity onPress={handleEmailPress}>
        <Text style={styles.supportContact}>{supportContact}</Text>
      </TouchableOpacity>



      <Text style={styles.notification}>If you need any assistance, feel free to reach out!</Text>
      <Text style={styles.inspirationText}>Keep achieving great things with Lista!</Text>






      <TouchableOpacity style={styles.settingOption} onPress={handleRateApp}>
        <Text style={styles.settingText}>Rate Us</Text>
      </TouchableOpacity>



      {/* אולי להוסיף התראות ליומן????? */}

      {/* <TouchableOpacity style={styles.settingOption} onPress={() =>  */}
      {/* לפתוח מסך עם אפשרויות */}
      {/* }> */}
      {/* <Text style={styles.settingText}>Notification Settings</Text> */}
      {/* </TouchableOpacity> */}

      {/* אולי להוסיף התראות ליומן????? */}
{/* 

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
            <ColorPicker
              onColorChange={handleBackgroundColorChange}
              sliderComponent={Slider as any}
            />
          )}
          {isTextColorPickerVisible && (
            <ColorPicker
              onColorChange={handleTextColorChange}
              sliderComponent={Slider as any}
            /> */} 

      <TouchableOpacity onPress={navigateToEditProfile} style={styles.editProfileButton}>
        <Ionicons name="pencil-outline" size={30} color="green" />
        <Text style={styles.iconLabel}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          © All rights reserved to Coral Landau, Founder of Lista.
        </Text>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    marginVertical: 20,
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
  logoutButton: {
    position: 'absolute', // למיקום בעמוד
    top: 20, // למקם למעלה (בקרבת שם המשתמש)
    right: 20, // למקם בצד ימין של המסך
    backgroundColor: '#f5f5f5',  // השתנה לצבע הרקע של הדף
    padding: 10, // להוסיף מרווחים
    borderRadius: 50, // עיגול מלא
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    color: 'black',
    marginTop: 5,

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

});

export default Settings;
