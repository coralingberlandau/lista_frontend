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
import { Ionicons } from '@expo/vector-icons';


type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register: React.FC<{ setIsLoggedIn: Dispatch<SetStateAction<boolean | null>> }> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null); // מצב חדש עבור שגיאות מייל

  // משתנה לבדיקת מילוי כל השדות
  const allFieldsFilled: boolean =
    username.trim() !== '' &&
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '';

  // פונקציית בדיקת מייל
  const isValidEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleRegister = async () => {
    console.log('Register button pressed'); // הוספת לוג כאן

    setError(null);
    setEmailError(null); // איפוס שגיאת המייל לפני הבדיקה

    if (!allFieldsFilled) {
      setError('All fields must be filled in to complete the registration.');
      console.log('All fields not filled'); // לוג נוסף
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('The email is invalid. Please enter a valid email address.'); // הגדרת שגיאת מייל אם הוא לא תקין
      return; // הפסקת התהליך אם המייל לא תקין
    }

    if (username && firstName && lastName && email && password) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/register/', {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Input
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Input
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <Button title="Register" onPress={handleRegister} />

      {/* הצגת הודעות השגיאה */}
      {(error || emailError) && (
        <Text style={styles.erroText}>
          {error || emailError} {/* הצגת אחת מהשגיאות */}
        </Text>
      )}
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
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
    position: 'relative', // מאפשר מיקום של האייקון בתוך הקלט
  },
  input: {
    height: 50,
    paddingLeft: 40, // רווח לשם האייקון בצד שמאל
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    fontSize: 16,
    paddingVertical: 10,
  },
  icon: {
    position: 'absolute',
    left: 10, // מיקום האייקון בצד שמאל
    top: '50%',
    transform: [{ translateY: -16 }], // מיישר את האייקון באמצע
  },
  
});

export default Register;