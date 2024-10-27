import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input'; // Adjust path if necessary
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './type'; // Ensure the path is correct

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();

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

        if (response.status === 201) {
          Alert.alert('Registration Successful', 'You can now log in.');
          navigation.navigate('Login'); // Navigate to Login screen
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
