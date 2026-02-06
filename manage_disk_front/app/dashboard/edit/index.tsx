import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  let id = -1;
  const router = useRouter();
  let savedPassword = "";

  const [showPassword, setShowPassword] = useState({
    password: false,
    password2: false,
  });
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState({
          empty: false,
          mismatch: false,
          error: '',
          success: false,
          already: false,
  });

  function togglePassword(field: 'password' | 'password2') {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    }

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');

        if (!storedUsername || storedUsername.trim() === '') {
          setIsLoading(false);
          return;
        }

        setUsername(storedUsername);
        console.log('Username from AsyncStorage:', storedUsername);

        //const url = 'http://localhost:8080/utilisateurs';
        const url = 'http://back:8078/utilisateurs';
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        const index = result.findIndex((u: any) => u.email === storedUsername);

        if (index !== -1) {
          setUserData({
            nom: result[index].nom,
            prenom: result[index].prenom,
            email: result[index].email,
          });
          savedPassword = result[index].password;
          id = result[index].id;
        }

        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
          console.log('User ID:', id);
  }, []);

  if (!isLoading && !username) {
    return <Redirect href="/login" />;
  }

  const cancel = () => {
    if (Platform.OS === 'web') {
        const conf = window.confirm('Are you sure to cancel the edit ?');
        if (conf) {
            router.push('/dashboard');
        }
    }
    Alert.alert(
      'Cancel',
      'Are you sure to cancel the edit ?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => router.push('/dashboard') },
      ]
    );
  };

  const update = async () => {
    //const url0 = 'http://localhost:8080/utilisateurs';
    const url0 = 'http://back:8078/utilisateurs';
    const request = await fetch(url0);
    const response = await request.json();
    const user = response.find((u: any) => u.email === username);
    const requestBody: any = {
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      password: newPassword,
    };
    if (newPassword == '') {
      requestBody.password = user.password;
    }
    //const url = `http://localhost:8080/utilisateurs/${user.id}`;
    const url = `http://back:8078/utilisateurs/${user.id}`;
    console.log('Update URL:', url);
    const response0 = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },  
      body: JSON.stringify(requestBody),
    });
    await AsyncStorage.setItem('username', userData.email);
    const result0 = await response0.json();
    return result0;
  }

  const validate = async () => {
    setMessages({ empty: false, mismatch: false, error: '', success: false, already: false });
    if (!userData.email || !userData.nom || !userData.prenom) {
      setMessages(prev => ({ ...prev, empty: true }));
      return;
    }

    if (newPassword || newPassword2) {
      if (newPassword !== newPassword2) {
        setMessages(prev => ({ ...prev, mismatch: true }));
        return;
      }
    }

    if (userData.email !== username) {
      try {
        const url = 'http://back:8078/utilisateurs';
        //const url = 'http://localhost:8080/utilisateurs';
        const response = await fetch(url);
        const result = await response.json();
        const index = result.findIndex((obj: { email: string }) => obj.email === userData.email);
        if (index !== -1) {
          setMessages(prev => ({ ...prev, already: true }));
          return;
        }
      } catch (e) {
        setMessages(prev => ({ ...prev, error: `Error during email check: ${e}` }));
        return;
      }
    }

    try {
      // 🔧 logique backend à adapter selon ton API
      if (newPassword == "" && newPassword2 == "") {
        console.log('Updated data:', userData);
    }
      console.log('Updated data:', {
        ...userData,
        password: newPassword || undefined,
      });
      if (Platform.OS === 'web') {
          const conf = window.confirm('Are you sure to update your informations ?');
          if (!conf) return;
          await update();
          setMessages(prev => ({ ...prev, success: true }));
          setTimeout(() => router.push('/dashboard'), 1000);
          return;
      }

      await update();
      setMessages(prev => ({ ...prev, success: true }));
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (e) {
      Alert.alert('Error', 'Failed to update informations');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <Text style={styles.title}>Manage disk - Edit your informations</Text>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Last name :</Text>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor="#999"
            value={userData.nom}
            onChangeText={(text) =>
              setUserData({ ...userData, nom: text })
            }
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>First name :</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor="#999"
            value={userData.prenom}
            onChangeText={(text) =>
              setUserData({ ...userData, prenom: text })
            }
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email* :</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          onChangeText={(text) =>
            setUserData({ ...userData, email: text })
          }
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>New password :</Text>
        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword.password}  // <-- bascule ici
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Pressable onPress={() => togglePassword('password')}>
        <Text style={styles.link}>Display password</Text>
        </Pressable>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>New password (to reconfirm) :</Text>
        <TextInput
          style={styles.input}
          placeholder="New password (to reconfirm)"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword.password2}  // <-- bascule ici
          value={newPassword2}
          onChangeText={setNewPassword2}
        />
        <Pressable onPress={() => togglePassword('password2')}>
        <Text style={styles.link}>Display password</Text>
        </Pressable>
      </View>


      {messages.already && <Text style={{ ...styles.rouge }}>An other account has already been created with this email address.</Text>}
                  {messages.empty && <Text style={{ ...styles.rouge }}>* : Required fields</Text>}
                  {messages.success && <Text style={{ ...styles.vert }}>Editing successful.</Text>}
                  {messages.mismatch && <Text style={{ ...styles.rouge }}>The email addresses or passwords do not match.</Text>}
                  {messages.error && <Text style={{ ...styles.rouge }}>{messages.error}</Text>}

      <View style={styles.buttons}>
        
        <Pressable style={styles.button} onPress={validate}>
          <Text style={styles.buttonText}>Validate</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={cancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  rouge:{
    color: 'red',
  },
  vert:{
    color:'green',
  },
  title: {
    color: 'white',
    fontSize: 22,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    flex: 1,
    marginBottom: 15,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    color: 'black',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  link: {
    color: '#4ea1ff',
  },
  button: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
