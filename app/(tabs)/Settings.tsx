import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


type SettingsProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
};

const Settings: React.FC<SettingsProps> = ({ setIsLoggedIn }) => {
  const appName = "Lista Application";
  const version = "1.0.0";
  const supportContact = "lista support: listaassistance@gmail.com"

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${supportContact.split(': ')[1]}`)
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsLoggedIn(false); // מנתק את המשתמש על ידי עדכון הסטטוס ל-false
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({
        type: 'error',
        text1: 'Error logging out',
        text2: 'Please try again later',
      });
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await AsyncStorage.removeItem('token');
  //     await AsyncStorage.removeItem('userName');
  //     await AsyncStorage.removeItem('userId');

  //     setIsLoggedIn(false);

  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //     Alert.alert('Error', 'Something went wrong while logging out.');
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{appName}</Text>
      <Text style={styles.version}>Version: {version}</Text>

      <Text style={styles.sectionTitle}>General Settings</Text>
      <TouchableOpacity style={styles.settingOption} onPress={() => { }}>
        <Text style={styles.settingText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingOption} onPress={() => { }}>
        <Text style={styles.settingText}>Theme</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Support</Text>
      <Text style={styles.supportInfo}>For assistance, please contact:</Text>
      <TouchableOpacity onPress={handleEmailPress}>
        <Text style={styles.supportContact}>{supportContact}</Text>
      </TouchableOpacity>

      <Text style={styles.notification}>If you need any assistance, feel free to reach out!</Text>
      <Text style={styles.inspirationText}>
        Keep achieving great things with Lista!
      </Text>
      <Text style={styles.footerText}>
        © All rights reserved to Coral Landau, Founder of Lista.
      </Text>
      <Button title="Logout" onPress={handleLogout} />
      {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <AntDesign name="logout" size={30} color="black" />
          </TouchableOpacity> */}
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
    color: 'green',
    marginVertical: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginVertical: 20,
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
  //   right: 20, // למקם בצד ימין של המסך
  //   backgroundColor: 'white',
  //   padding: 10, // להוסיף מרווחים
  //   borderRadius: 50, // עיגול מלא
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

});

export default Settings;