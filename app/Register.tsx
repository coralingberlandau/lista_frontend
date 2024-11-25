import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input'; 
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { JwtPayload, RootStackParamList } from './type'; 
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register: React.FC<{ setIsLoggedIn: Dispatch<SetStateAction<boolean | null>> }> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null); 

  const allFieldsFilled: boolean =
    username.trim() !== '' &&
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '';

  const isValidEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };


  const handleRegister = async () => {
    setError(null);
    setEmailError(null);
  
    if (!allFieldsFilled) {
      setError('All fields must be filled in to complete the registration.');
      return;
    }
  
    if (!isValidEmail(email)) {
      setEmailError('The email is invalid. Please enter a valid email address.');
      return;
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
  
        if (response.status === 201) {
          const accessToken = response.data.access;
  
          const decodedToken: JwtPayload = jwtDecode(accessToken);
  
          const userId = decodedToken.user_id;
  
          if (userId === undefined) {
            throw new Error("User ID is undefined");
          }
  
          await AsyncStorage.setItem('token', accessToken);
          await AsyncStorage.setItem('userId', userId.toString());
          await AsyncStorage.setItem('userName', username);
  
          Alert.alert('Registration Successful', 'You can now log in.');
          Toast.show({
            type: 'success',
            text1: 'The user has been saved successfully!',
          });
  
          setIsLoggedIn(true);
  
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          );
        }
      } catch (error) {
        console.log('Error caught:', error);
  
        if (axios.isAxiosError(error)) {
          console.log('Error caught:', error);
          console.log('Response data:', error.response?.data);
  
          if (error.response) {
            if (error.response.status === 400) {
              setError(error.response.data.error); 
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

  return (

    <ScrollView contentContainerStyle={styles.container}>
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

      {(error || emailError) && (
        <Text style={styles.erroText}>
          {error || emailError}
        </Text>
      )}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Click here to log in</Text>
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

export default Register;
