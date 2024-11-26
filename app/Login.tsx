import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload, RootStackParamList } from './type';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC<{ setIsLoggedIn: Dispatch<SetStateAction<boolean | null>> }> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorText, setErrorText] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const SERVER = "https://lista-backend-n3la.onrender.com"

  const handleLogin = async () => {
    setErrorText('');

    if (!username || !password) {
      setErrorText('Please enter both username and password.');
      return;
    }

    if (username && password) {
      try {
        const response = await axios.post(`${SERVER}/login/`, {
          username,
          password,
        });

        const accessToken = response.data.access;
        const decodedToken: JwtPayload = jwtDecode(accessToken);
        const userId = decodedToken.user_id;

        if (userId === undefined) {
          throw new Error("User ID is undefined");
        }

        const customizations = await axios.get(`${SERVER}/customizations/get_user_customization/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (customizations.status === 200) {
          await AsyncStorage.setItem('customizations', customizations.data.data.background_image_id);
        }

        await AsyncStorage.setItem('token', accessToken);
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('userName', username);

        setIsLoggedIn(true);
      } catch (error: any) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          setErrorText('Incorrect username or password. Please try again.');
        } else {
          setErrorText('Something went wrong. Please try again.');
        }
      }
    };
  }

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToResetPassword = () => {
    navigation.navigate('ResetPassword');
  };

  return (

    <ScrollView contentContainerStyle={styles.container}> 
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
    </ScrollView>
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
    position: 'relative',
  },
  input: {
    height: 50,
    paddingLeft: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    fontSize: 16,
    paddingVertical: 10,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -16 }],
  },
});

export default Login;
