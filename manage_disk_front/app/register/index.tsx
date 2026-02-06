import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        username: '',
        username2: '',
        password: '',
        password2: '',
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        password2: false,
    });
    const [messages, setMessages] = useState({
        empty: false,
        mismatch: false,
        error: '',
        success: false,
    });

    async function register() {
        // Réinitialiser les messages
        setMessages({ empty: false, mismatch: false, error: '', success: false });

        // Vérifier les champs vides
        if (!formData.nom || !formData.prenom || !formData.username || !formData.username2 || !formData.password || !formData.password2) {
            setMessages(prev => ({ ...prev, empty: true }));
            return;
        }

        // Vérifier les correspondances
        if (formData.username !== formData.username2 || formData.password !== formData.password2) {
            setMessages(prev => ({ ...prev, mismatch: true }));
            return;
        }

        try {
            // Vérifier si l'email existe déjà
            //const response = await fetch('http://localhost:8080/utilisateurs');
            const response = await fetch('http://back:8078/utilisateurs');
            const result = await response.json();
            const index = result.findIndex((obj: { email: string }) => obj.email === formData.username);

            if (index === -1) {
                // Enregistrer l'utilisateur
                const { nom, prenom, username, password } = formData;
                const url = 'http://back:8078/utilisateurs';
                //const url = 'http://localhost:8080/utilisateurs';
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom, prenom, email: username, password }),
                });

                // Sauvegarder le username et rediriger
                await AsyncStorage.setItem('username', formData.username);
                setMessages(prev => ({ ...prev, success: true }));
                setTimeout(() => router.push('/login'), 1500);
            } else {
                setMessages(prev => ({ 
                    ...prev, 
                    error: 'Error during registration: This email address is already used.' 
                }));
            }
        } catch (error) {
            setMessages(prev => ({ 
                ...prev, 
                error: `Error during registration: ${error}` 
            }));
        }
    }

    function togglePassword(field: 'password' | 'password2') {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    }

    return (
        <View style={styles.body}>
            <Text style={styles.title}>Manage disk - Register</Text>
            <View style={styles.form}>

  <View style={styles.row}>
    <TextInput
      style={styles.input}
      placeholder="Last name*"
      placeholderTextColor="#999"
      value={formData.nom}
      onChangeText={v => setFormData({ ...formData, nom: v })}
    />
  </View>

  <View style={styles.row}>
    <TextInput
      style={styles.input}
      placeholder="First name*"
      placeholderTextColor="#999"
      value={formData.prenom}
      onChangeText={v => setFormData({ ...formData, prenom: v })}
    />
  </View>

  <View style={styles.row}>
    <TextInput
      style={styles.input}
      placeholder="Email address*"
      placeholderTextColor="#999"
      value={formData.username}
      onChangeText={v => setFormData({ ...formData, username: v })}
    />
  </View>

  <View style={styles.row}>
    <TextInput
      style={styles.input}
      placeholder="Confirm email*"
      placeholderTextColor="#999"
      value={formData.username2}
      onChangeText={v => setFormData({ ...formData, username2: v })}
    />
  </View>

  <View style={styles.row}>
    <TextInput
      style={styles.input}
      placeholder="Password*"
      placeholderTextColor="#999"
      secureTextEntry={!showPassword.password}
      value={formData.password}
      onChangeText={v => setFormData({ ...formData, password: v })}
    />
    <Pressable onPress={() => togglePassword('password')}>
    <Text style={styles.link}>Display password</Text>
  </Pressable>
  </View>

  <View style={styles.row}>
    <TextInput
      style={styles.input}
      placeholder="Confirm password*"
      placeholderTextColor="#999"
      secureTextEntry={!showPassword.password2}
      value={formData.password2}
      onChangeText={v => setFormData({ ...formData, password2: v })}
    />
    <Pressable onPress={() => togglePassword('password2')}>
    <Text style={styles.link}>Display password</Text>
  </Pressable>
  </View>

  
  <View style={styles.row}>
    <Pressable style={styles.button} onPress={register}>
      <Text>Register</Text>
    </Pressable>
</View>
<View style={styles.row}>
    <Pressable style={styles.button} onPress={() => router.push('/login')}>
      <Text>Return</Text>
    </Pressable>
  </View>

</View>

            {messages.empty && <p style={{ ...styles.rouge }}>* : Required fields</p>}
            {messages.success && <p style={{ ...styles.vert }}>Register successful. Please login on the login page.</p>}
            {messages.mismatch && <p style={{ ...styles.rouge }}>The email addresses or passwords do not match.</p>}
            {messages.error && <p style={{ ...styles.rouge }}>{messages.error}</p>}
        </View>
    );
}
const styles = StyleSheet.create({
    vert:{
        color:'green',
    },
    rouge:{
        color: 'red',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    no_display:{
        display: 'none',
    },
    body: {
        fontFamily: 'Arial',
        color:'white',
        backgroundColor: 'black',
        minHeight: '100%',        // <-- couvre toute la fenêtre
        margin: 0,
        padding: 0,

        display: 'flex',           // <-- centre verticalement et horizontalement
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    form: {
        textAlign: 'left',
        width: 480,                // largeur fixe pour un centrage strict
        justifyContent: 'center',
    },
    tdButton: {
        padding: 0,           // pour coller le bouton au bord du <td>
        verticalAlign: 'middle',
    },
    label: {
    width: 140,          // ⭐ clé de l’alignement
    color: 'white',
  },
  link: {
    color: '#4ea1ff',
    marginBottom: 10,
  },
    title: {
        color: 'white',
        fontSize: 22,
        marginBottom: 20,
    },
        input: {
    width: 260,
    borderWidth: 1,
    borderColor: '#666',
    color: 'white',
    padding: 10,
    marginBottom: 12,
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
    }
});