import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Button, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BackgroundImage, RootStackParamList } from '../type';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import axios from 'axios';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash';

type SettingsProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
};

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const Settings: React.FC<SettingsProps> = ({ setIsLoggedIn }) => {
  const appName = "Lista Application";
  const version = "1.0.0";
  const supportContact = "listaassistance@gmail.com";
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<number | null>(null); 

  

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // אחסון התמונה שנבחרה
  const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] = useState(false); // מצב של תצוגת הבחירה
  const [isModalVisible, setIsModalVisible] = useState(false);


  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${supportContact.split(': ')[1]}`);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({
        type: 'error',
        text1: 'Error logging out',
        text2: 'Please try again later',
      });
    }
  };

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

  const debounceSaveToServer = _.debounce(async (imageId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `http://127.0.0.1:8000/customizations/`,
        {
          background_image_id: imageId || 0, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
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

  const handleBackgroundChange = async (imageId: number) => {
    setSelectedImage(imageId);
    debounceSaveToServer(imageId); 
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text style={styles.inspirationText}>Keep achieving great things with Lista! </Text>
      <Text style={styles.inspirationText}>We’re here to make your life easier and more organized. 😊  </Text>
      <TouchableOpacity onPress={navigateToEditProfile} style={styles.editProfileButton}>
        <Ionicons name="pencil-outline" size={30} color="green" />
        <Text style={styles.iconLabel}>Edit Profile</Text>
      </TouchableOpacity>
      <Ionicons name="color-palette-outline" size={33} color="black" style={styles.icon} />
      <Text style={[styles.iconLabel]}>Background</Text>
      <View style={styles.backgroundPickerContainer}>
        <FlatList
          data={backgroundImages} 
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
          keyExtractor={(item) => item.id.toString()} 
          numColumns={3} 
        />
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          © All rights reserved to Coral Landau, Founder of Lista.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#f5f5f5',
    position: 'relative', 
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
    marginVertical: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center', 
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
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,

  },
  iconLabel: {
    color: 'black',
    marginTop: 5,
    fontSize: 16,
  },
  iconLabelLogout: {
    color: 'black',
    marginTop: 5,
    fontSize: 14,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
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
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
  },
  boldText: {
    fontWeight: 'bold',
  },
  selectedBackgroundImage: {
    borderColor: 'blue',
    borderWidth: 4,
  },
  icon: {
    marginRight: 10,
  },

});

export default Settings;
