import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios'; // הוספת Axios
import { jwtDecode } from 'jwt-decode'; // זה הייבוא הנכון של jwt-decode
import { JwtPayload, RootStackParamList } from './type';

// הגדרת סוג הניווט למסך הלוגין
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC<{setIsLoggedIn: Dispatch<SetStateAction<boolean | null>>}> = ({setIsLoggedIn}) => {
  const [username, setUsername] = useState<string>(''); // שדה שם משתמש
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<LoginScreenNavigationProp>();



  const handleLogin = async () => {
    if (username && password) {
      try {
        // קריאה ל-API לבדוק את פרטי ההתחברות
        const response = await axios.post('http://127.0.0.1:8000/login', {
          username, // שליחה של שם משתמש
          password,
        });

        console.log('======== Response ========');
        console.log(response);

        const accessToken = response.data.access; // קבלת הטוקן מהשרת

        // פענוח הטוקן באמצעות jwtDecode
        const decodedToken: JwtPayload = jwtDecode(accessToken);
        console.log('Decoded token:', decodedToken);

        // קבלת ה-user_id מהטוקן
        const userId = decodedToken.user_id;
        console.log('User ID from token:', userId);

        // בדיקה אם userId קיים
        if (userId === undefined) {
          throw new Error("User ID is undefined");
        }

        // שמירת הטוקן וה-userId באחסון המקומי (AsyncStorage)
        await AsyncStorage.setItem('token', accessToken); // שמירה של הטוקן
        await AsyncStorage.setItem('userId', userId.toString()); // שמירת ה-userId
        await AsyncStorage.setItem('userName', username); // שמירה של שם המשתמש

        console.log('Logged in successfully');
        setIsLoggedIn(true);
      } catch (error) {
        console.error(error);
        Alert.alert('Login Error', 'Unable to login. Please check your credentials and try again.');
      }
    } else {
      Alert.alert('Invalid Credentials', 'Please enter both username and password.');
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register'); // נווט למסך ה-Register
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Input
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your user name"
        autoCapitalize="none"
      />

      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
      />

      <Button title="Login" onPress={handleLogin} />

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Not registered?</Text>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.registerLink}>Click here to sign up</Text>
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
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#555',
  },
  registerLink: {
    fontSize: 14,
    color: '#1E90FF',
    marginTop: 5,
  },
});

export default Login;
