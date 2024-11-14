import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native'; // Import useRoute hook
import { Ionicons } from '@expo/vector-icons';


type NavigationProps = StackNavigationProp<RootStackParamList>;
type RootStackParamList = {
  ChangePassword: { email: string }; // Define the 'email' parameter for this screen
};

type ChangePasswordRouteProp = RouteProp<RootStackParamList, 'ChangePassword'>;

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState<string>(''); // Password input
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // Confirm Password input
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const navigation = useNavigation<NavigationProps>(); // Navigation hook
  const route = useRoute<ChangePasswordRouteProp>(); // Type the useRoute hook
  const { email } = route.params; // Destructure the email param

  const validatePasswords = (): boolean => {
    if (password !== confirmPassword) {
      setErrorText('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    setErrorText(''); // Clear previous errors

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
      // Replace with the backend API endpoint for changing the password
      const response = await axios.post('http://127.0.0.1:8000/reset_password/', {
        email,
        password,
      });

      console.log('====================================');
      console.log(response);
      console.log('====================================');

      setMessage('Password has been changed successfully!');
      // Redirect to login screen on success
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
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      
      <Button
        title={loading ? 'Changing Password...' : 'Change Password'}
        onPress={handleChangePassword}
        disabled={loading}
      />

      {message || errorText ? (
        <Text style={message ? styles.message : styles.errorText}>
          {message || errorText}
        </Text>
      ) : null}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
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

export default ChangePassword;
