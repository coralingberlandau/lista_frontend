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
  const [error, setError] = useState<string | null>(null);

  // משתנה לבדיקת מילוי כל השדות
  const allFieldsFilled: boolean =
    username.trim() !== '' &&
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '';

  const handleRegister = async () => {
    console.log('Register button pressed'); // הוספת לוג כאן
    if (!allFieldsFilled) {
      setError('All fields must be filled in to complete the registration.');
      console.log('All fields not filled'); // לוג נוסף

      return;
    }

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
              routes: [{ name: 'Home' }], // העברת פרמטרים אם יש צורך
            })
          );
        }
      } catch (error) {
        console.log('Error caught:', error);
        // לוג של השגיאה

        // נוודא שהשגיאה מתעדכנת כמו שצריך
        if (axios.isAxiosError(error)) {
          console.log('Error caught:', error); // לוג של השגיאה
          console.log('Response data:', error.response?.data); // לוג של נתוני השגיאה

          if (axios.isAxiosError(error)) {
            if (error.response) {
              // בדוק אם הסטטוס הוא 400
              if (error.response.status === 400) {
                setError(error.response.data.error); // הגדרת השגיאה מהשרת
              } else {
                setError('Error 500 - Something went wrong. Please try again.');
              }
            } else {
              setError('Unexpected error occurred. Please try again later.');
            }
          } else {
            setError('Unexpected error occurred. Please try again later.');
          }
        }
      }
    };
  }

        // {/* {/*  */}
        // {error === 'Username already exists' ? (
        //   <Text style={{ color: 'red', textAlign: 'center' }}>This username is already taken. Please choose another one.</Text>
        // ) :
        //   (!allFieldsFilled ? (
        //     <Text style={{ color: 'red', textAlign: 'center' }}>All fields must be filled in to complete the registration.</Text>
        //   ) : (
        //     <Text style={{ color: 'red', textAlign: 'center' }}>Error 500 - Something went wrong. Please try again.</Text>
        //   ))} 

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

      {error && <Text style={styles.erroText}>{error}</Text>}

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
  erroText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    height: 0, // המרווח הרצוי (תוכל לשנות לפי הצורך)

  },
});

export default Register;
