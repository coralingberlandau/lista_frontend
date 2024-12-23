import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, Dimensions, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './type';
import { Ionicons } from '@expo/vector-icons';

type WelcomeProps = StackScreenProps<RootStackParamList, 'Welcome'>;
const { width } = Dimensions.get('window');

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
    const navigateToLogin = () => {
        navigation.navigate('Login');
    };

    const navigateToRegister = () => {
        navigation.navigate('Register');
    };

    const openServerLink = () => {
        Linking.openURL('https://lista-backend-n3la.onrender.com/');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require('../assets/images/lista.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome to application LISTA</Text>
            <Text style={styles.description}>
                <Text style={styles.bold}>Lista</Text> is your ultimate solution for organizing and managing personal and shared lists.
                {'\n'}It combines real-time updates, customization options, and a user-friendly experience.
                {'\n\n'}Document sharing is available for users who are registered in the app, using their email address.
                {'\n'}Permissions can be set for read-only access or full editing capabilities.
            </Text>
            <Text style={styles.subtitle}>
                Before using the application, please ensure the server is running.{'\n'}
                Since the backend server is hosted on a free-tier service, it may take some time to wake up.{'\n'}
                Kindly wait until you see a status code of 200 or the 'Django REST framework' interface before proceeding.{'\n'}
                Once the server is ready, you can fully use the application.{'\n'}
            </Text>
            <TouchableOpacity onPress={openServerLink} style={styles.linkContainer}>
                <Text style={styles.link}>https://lista-backend-n3la.onrender.com/</Text>
            </TouchableOpacity>
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={navigateToLogin}>
                    <Ionicons name="log-in-outline" size={24} color="#fff" />
                    <Text style={styles.actionText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={navigateToRegister}>
                    <Ionicons name="person-add-outline" size={24} color="#fff" />
                    <Text style={styles.actionText}>Register</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    logo: {
        width: width * 0.3,
        height: width * 0.3,
        marginBottom: 20,
    },
    title: {
        fontSize: width > 350 ? 26 : 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: '#555',
        marginBottom: 30,
    },
    bold: {
        fontWeight: 'bold',
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E90FF',
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    actionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        fontSize: 16,
        color: '#1E90FF',
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginBottom: 3,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'center',
    },
});

export default Welcome;
