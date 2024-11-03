import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input'; // Adjust path if necessary
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { JwtPayload, RootStackParamList } from './type'; // Ensure the path is correct
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register: React.FC<{ setIsLoggedIn: Dispatch<SetStateAction<boolean | null>> }> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // const handleRegister = async () => {
  //   if (username && firstName && lastName && email && password) {
  //     try {
  //       const response = await axios.post('http://127.0.0.1:8000/register', {
  //         username,
  //         first_name: firstName,
  //         last_name: lastName,
  //         email,
  //         password,
  //       });

  //       console.log('====================================');
  //       console.log(response);
  //       console.log('====================================');

  //       if (response.status === 201) {
  //         Alert.alert('Registration Successful', 'You can now log in.');

  //         // נווט לדף הבית, עם פרמטר refresh
  //         // navigation.navigate('Home', { refresh: true })

  //         navigation.navigate('Login'); 
  //         // Navigate to Login screen.
  //       }
  //     } catch (error) {
  //       Alert.alert('Registration Error', 'Unable to register. Please try again.');
  //     }
  //   } else {
  //     Alert.alert('Missing Information', 'Please fill out all fields.');
  //   }
  // };


  const handleRegister = async () => {
    if (username && firstName && lastName && email && password) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/register', {
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        });

        console.log('====================================');
        console.log(response.data, "thissss tokernn????", response.data.access);
        console.log('====================================');

        if (response.status === 201) {
          const accessToken = response.data.access; // קבלת הטוקן מהשרת

          // פענוח הטוקן באמצעות jwtDecode
          const decodedToken: JwtPayload = jwtDecode(accessToken);
          console.log('Decoded token:', decodedToken);

          // קבלת ה-user_id מהטוקן
          const userId = decodedToken.user_id; // ודא שהשדה הזה קיים בטוקן

          // בדיקה אם userId קיים
          if (userId === undefined) {
            throw new Error("User ID is undefined");
          }

          // שמירה של הטוקן וה-userId באחסון המקומי (AsyncStorage)
          await AsyncStorage.setItem('token', accessToken); // שמירה של הטוקן
          await AsyncStorage.setItem('userId', userId.toString()); // שמירת ה-userId
          await AsyncStorage.setItem('userName', username); // שמירה של שם המשתמש

          console.log('testtttt tokennnnn', accessToken);
          Alert.alert('Registration Successful', 'You can now log in.');
          Toast.show({
            type: 'success',
            text1: 'The user has been saved successfully!',
          });

          // עדכון isLoggedIn למעבר ל-Tab.Navigator
          setIsLoggedIn(true);

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home', params: { refresh: true } }], // העברת פרמטרים אם יש צורך
            })
          );
          

          // navigation.navigate('Home');
      
        }
        } catch (error) {
          Alert.alert('Registration Error', 'Unable to register. Please try again.');
        }
      } else {
        Alert.alert('Missing Information', 'Please fill out all fields.');
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
        />

        <Input
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />

        <Input
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />

        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
        />

        <Button title="Register" onPress={handleRegister} />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Click here to log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    loginContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    loginText: {
      fontSize: 14,
      color: '#555',
    },
    loginLink: {
      fontSize: 14,
      color: '#1E90FF',
      marginTop: 5,
    },
  });

  export default Register;
