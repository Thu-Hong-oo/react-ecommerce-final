import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function ForgotPassword({navigation}) {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        // Giả sử chúng ta chỉ hiển thị thông báo cho việc submit
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
        } else {
            Alert.alert("Success", "We have sent you an email to reset your password.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot password?</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            <Text style={styles.infoText}>
                * We will send you a message to set or reset your new password
            </Text>
            <Button
                title="Submit"
                onPress={handleSubmit}
                color="#f97316" // Dùng màu cam tương tự Tailwind's orange-500
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
       alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        fontSize: 16,
    },
    infoText: {
        fontSize: 12,
        color: '#ef4444', // Red color
        marginBottom: 20,
    },
});


