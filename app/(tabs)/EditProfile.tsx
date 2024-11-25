import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

type EditProfileProps = {
    setIsLoggedIn: Dispatch<SetStateAction<boolean | null>>;
};

const EditProfile: React.FC<EditProfileProps> = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const navigation = useNavigation();
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const loadUserData = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) setUserId(storedUserId);

            const storedUsername = await AsyncStorage.getItem('userName');
            if (storedUsername) setUsername(storedUsername);

            if (userId) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/user/${userId}/`);
                    setFirstName(response.data.first_name);
                    setLastName(response.data.last_name);
                    setEmail(response.data.email);
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            }
        };

        loadUserData();
    }, [userId]);

    const allFieldsFilled = username && firstName && lastName && email;

    useEffect(() => {
        if (firstName && lastName && email) {
            setIsLoading(false);
        }
    }, [firstName, lastName, email]);

    const isValidEmail = (email: string): boolean => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSaveChanges = async () => {
        setError(null);
        setEmailError(null);

        if (!allFieldsFilled) {
            setError('All fields must be filled to update your profile.');
            return;
        }
        if (!isValidEmail(email)) {
            setEmailError('The email is invalid. Please enter a valid email address.');
            return;
        }
        
        if (userId) {
            try {
                const response = await axios.patch(`http://127.0.0.1:8000/user/${userId}/`, {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                });

                if (response.status === 200) {
                    await AsyncStorage.setItem('userName', username);
                    Toast.show({
                        type: 'success',
                        text1: 'Your profile has been updated successfully!',
                    });
                    setIsLoggedIn(true);
                    navigation.goBack();
                }
            } catch (error) {
                console.log('Error updating profile:', error);
                if (axios.isAxiosError(error) && error.response?.status === 400) {
                    const errorMsg = error.response.data.error;
                    if (errorMsg.includes('Username already exists')) {
                        setError('The username is already in use. Please choose a different one.');
                    } else if (errorMsg.includes('Email already in use')) {
                        setError('The email is already in use. Please choose a different one.');
                    } else {
                        setError('An error occurred. Please try again.');
                    }
                } else {
                    setError('An error occurred. Please try again.');
                }
            }
        } else {
            setError('User ID not found.');
            setIsLoggedIn(false);

        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
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
            {isLoading ? (
                <Text style={styles.loadingText}>Loading user data...</Text>
            ) : (
                <Button title="Save Changes" onPress={handleSaveChanges} />
            )}

            {(error || emailError) && (
                <Text style={styles.errorText}>
                    {error || emailError}
                </Text>
            )}
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
    loadingText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default EditProfile;
