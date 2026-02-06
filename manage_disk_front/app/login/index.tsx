
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [messages, setMessages] = useState({
        correct: false,
        empty: false,
        mismatch: false,
    });

    function togglePassword() {
        setShowPassword(!showPassword);
    }

    async function login() {
        // Réinitialiser les messages
        setMessages({ correct: false, empty: false, mismatch: false });

        const { username: email, password } = formData;

        // Vérifier les champs vides
        if (email === '' || password === '') {
            setMessages(prev => ({ ...prev, empty: true }));
            return;
        }

        try {
          //const url = 'http://localhost:8080/utilisateurs/login';
          const url = 'http://back:8078/utilisateurs/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const result = await response.json();

            if (result.success) {
                // Login successful
                setMessages(prev => ({ ...prev, correct: true }));
                // Save username to AsyncStorage
                await AsyncStorage.setItem('username', email);
                setTimeout(() => router.push('/dashboard'), 1500);
            } else {
                // Handle login error
                setMessages(prev => ({ ...prev, mismatch: true }));
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => ({ ...prev, mismatch: true }));
        }
    }

    return (
        <View style={styles.body}>
            <Text style={styles.title}>Manage disk - Login</Text>
            <Text>Please log in to continue.</Text>
            <View style={styles.form}>

  <View style={styles.row}>
    <Text style={styles.label}>Email address:</Text>
    <TextInput
      style={styles.input}
      placeholder="Email address"
      placeholderTextColor="#999"
      value={formData.username}
      onChangeText={(text) =>
        setFormData({ ...formData, username: text })
      }
    />
  </View>

  <View style={styles.row}>
    <Text style={styles.label}>Password:</Text>
    <TextInput
      style={styles.input}
      placeholder="Password"
      placeholderTextColor="#999"
      secureTextEntry={!showPassword}
      value={formData.password}
      onChangeText={(text) =>
        setFormData({ ...formData, password: text })
      }
    />
    
  </View>
  <View style={styles.row}>
    <Pressable onPress={() => router.push('/forgot')}>
      <Text style={styles.link}>Forgot password ?</Text>
    </Pressable>
    <Pressable onPress={togglePassword}>
      <Text style={styles.link}>Display password</Text>
    </Pressable>
    </View>

  <View>
    <Pressable style={styles.button} onPress={login}>
      <Text>Login</Text>
    </Pressable>

    <Pressable style={styles.button} onPress={() => router.push('/register')}>
      <Text>Register</Text>
    </Pressable>
  </View>

</View>

            {messages.correct && <Text style={{ ...styles.vert }}>Login successful.</Text>}
            {messages.empty && <Text style={{ ...styles.rouge }}>* : Required fields</Text>}
            {messages.mismatch && <Text style={{ ...styles.rouge }}>The email addresses or passwords do not match.</Text>}
        </View>
    );
}


const styles = StyleSheet.create({
    vert: {
        color: 'green',
    },
    label: {
    width: 140,          // ⭐ clé de l’alignement
    color: 'white',
  },
  link: {
    color: '#4ea1ff',
    marginBottom: 10,
  },
    rouge: {
        color: 'red',
    },
    body: {
        fontFamily: 'Arial',
        color: 'white',
        backgroundColor: 'black',
        minHeight: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    form: {
        textAlign: 'left',
        width: 480,
    },
    tdButton: {
        padding: 0,
        verticalAlign: 'middle',
    },
    title: {
        color: 'white',
        fontSize: 22,
        marginBottom: 20,
    },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    button: {
        width: '100%',        // occupe toute la largeur du <td>
        backgroundColor: 'white',
        color: 'black',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        textAlign: 'center',
        // cursor: 'pointer' // optionnel (peut ne pas être pris en charge par StyleSheet)
        marginBottom: 10,
    },
    input: {
    width: 260,
    borderWidth: 1,
    borderColor: '#666',
    color: 'white',
    padding: 10,
    marginBottom: 12,
  },
  blanc: {
    color: 'white',
  },
});