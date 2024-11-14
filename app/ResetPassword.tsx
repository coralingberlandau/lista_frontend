import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './type';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';


type NavigationProps = StackNavigationProp<RootStackParamList>;

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // הוספתי שדה לאימייל
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const navigation = useNavigation<NavigationProps>(); // הגדרת טיפוס הניווט

  const isValidEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const handleRequestResetLink = async () => {
    setErrorText(''); // ניקוי הודעת השגיאה לפני שליחה

    if (!email) {
      setErrorText('Please enter your email.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorText('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/reset_password_request/', {
        email,
      });

      console.log('====================================');
      console.log(response);
      console.log('====================================');

      setMessage('A reset link has been sent to your email.');
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send reset link. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login'); // נווט למסך הלוגין
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {/* <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      /> */}

  

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>


      <Button
        title={loading ? 'Sending Reset Link...' : 'Send Reset Link'}
        onPress={handleRequestResetLink}
        disabled={loading}
      />

      {message || errorText ? (
        <Text style={message ? styles.message : styles.errorText}>
          {message || errorText}
        </Text>
      ) : null}

      <Text style={styles.linkText}>Already have a password?</Text>
      <TouchableOpacity onPress={navigateToLogin}>
        <Text style={styles.linkTo}>Click here to login</Text>
      </TouchableOpacity>
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
    flexDirection: 'row', // מסדר את האייקון והטקסט באותו שורה
    alignItems: 'center', // ממרכז את האייקון והטקסט אנכית
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    paddingHorizontal: 10, // רווח פנימי משני הצדדים
    height: 50,
  },
  input: {
    flex: 1, // מאפשר ל-TextInput למלא את כל השטח הנותר
    fontSize: 16,
    paddingLeft: 10, // רווח לשם האייקון בצד שמאל
  },
  icon: {
    color: 'gray',
    top: '50%',
    transform: [{ translateY: -24}], // מיישר את האייקון באמצע
  },
  
});

export default ResetPassword;
