import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


type NavigationProps = StackNavigationProp<RootStackParamList>;
type RootStackParamList = {
  ChangePassword: { email: string };
};

type ChangePasswordRouteProp = RouteProp<RootStackParamList, 'ChangePassword'>;

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<ChangePasswordRouteProp>();
  const { email } = route.params;

  const validatePasswords = (): boolean => {
    if (password !== confirmPassword) {
      setErrorText('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    setErrorText('');

    if (!password || !confirmPassword) {
      setErrorText('Please fill in both fields.');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/reset_password/', {
        email,
        password,
      });

      console.log('====================================');
      console.log(response);
      console.log('====================================');

      setMessage('Password has been changed successfully!');
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to change password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="gray"
          style={styles.icon}/>

        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="gray"
          style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry />
      </View>

      <Button
        title={loading ? 'Changing Password...' : 'Change Password'}
        onPress={handleChangePassword}
        disabled={loading} />

      {message || errorText ? (
        <Text style={message ? styles.message : styles.errorText}>
          {message || errorText}
        </Text>
      ) : null}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    height: 50,
    paddingLeft: 40,
    borderRadius: 8,
    fontSize: 16,
    paddingVertical: 10,
  },
  message: {
    marginTop: 20,
    color: 'green',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  linkTo: {
    fontSize: 14,
    color: '#1E90FF',
    marginTop: 5,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 10, 
    top: '50%',
    transform: [{ translateY: -16 }], 
  },
});

export default ChangePassword;
