import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios'; 
import { jwtDecode } from 'jwt-decode'; 
import { JwtPayload, RootStackParamList } from './type';
import { Ionicons } from '@expo/vector-icons';


// הגדרת סוג הניווט למסך הלוגין
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC<{ setIsLoggedIn: Dispatch<SetStateAction<boolean | null>> }> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorText, setErrorText] = useState('');

  
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    // איפוס הודעת השגיאה
    setErrorText('');

    // בדוק אם יש שדות חסרים
    if (!username || !password) {
      setErrorText('Please enter both username and password.');
      return;
    }

    if (username && password) {
      try {
        // קריאה ל-API לבדוק את פרטי ההתחברות
        const response = await axios.post('http://127.0.0.1:8000/login/', {
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
      } catch (error: any) {
        console.error(error);
        // נבדוק אם יש שגיאה ספציפית
        if (error.response && error.response.status === 401) {
          setErrorText('Incorrect username or password. Please try again.');
        } else {
          setErrorText('Something went wrong. Please try again.');
        }
      }
    };
  }

  const navigateToRegister = () => {
    navigation.navigate('Register'); // נווט למסך ה-Register
  };

  const navigateToResetPassword = () => {
    console.log('שככחחתיייי סיסמהההה');
    navigation.navigate('ResetPassword');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>


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
          placeholder="Enter your username"
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
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />
      </View>






  


      {/* // <Input */}
      {/* //   value={username}
      //   onChangeText={setUsername}
      //   placeholder="Enter your username"
      //   autoCapitalize="none"
      //   leftIcon={ */}
      {/* //     <Ionicons name="person-outline" size={24} color="gray" />
      //   }
      //   containerStyle={{ */}
      {/* //     borderBottomWidth: 1,
      //     borderBottomColor: 'gray',
      //     paddingLeft: 10,
      //   }}
      // /> */}

      {/* <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
      /> */}

      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.errorText}>{errorText}</Text>
      <View style={styles.registerContainer}>

        <Text style={styles.registerText}>Not registered?</Text>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.linkTo}>Click here to sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToResetPassword}>
          <Text style={styles.linkTo}>Forgot password?</Text>
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
  linkTo: {
    fontSize: 14,
    color: '#1E90FF',
    marginTop: 5,
  },
  errorText: {
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

export default Login;