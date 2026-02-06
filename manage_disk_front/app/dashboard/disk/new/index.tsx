import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [username, setUsername] = useState<string | null>(null);
  var [click, setClick] = useState(0);
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [logged, setLogged] = useState(true);
  const [unity, setUnity] = useState("o");

  useEffect(() => {
    async function checkAuth() {
      try {
      AsyncStorage.getItem('username').then(setUsername);
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        setLogged(false);
        return;
      }

      //const url = 'http://localhost:8080/utilisateurs';
      const url = 'http://back:8078/utilisateurs';
      const usersRes = await fetch(url);
      const users = await usersRes.json();

      const currentUser = users.find((u: any) => u.email === username);
      if (!currentUser) {
        setLogged(false);
        return;
      }
    } catch (e) {
      console.error(e);
      setLogged(false);
    }
}    checkAuth();
  }, []);

  if (!logged) {
    return <Redirect href="/login" />;
  }

  function countDecimals(num: number) {
    const parts = num.toString().split('.');
    return parts[1]?.length ?? 0;
  }

  function cancel() {
    if (Platform.OS == 'web') {
        const confirm = window.confirm('Are you sure to cancel disk creation ?');
        if (confirm) {
            router.replace('/dashboard');
        }
    }
    Alert.alert(
      'Cancel',
      'Are you sure to cancel disk creation ?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => router.replace('/dashboard') },
      ]
    );
  }
  

    function regex(reg:RegExp, str: string) {
      return new RegExp(reg).test(str);
    }

  async function valider() {
    setClick(click++);
    setError('');
    setSuccess(false);
    setSize(size.replace(',', '.'));
    if (click >= 2){
    let parsedSize = size == '' ? 0 : parseFloat(size);
    if (unity == "Ko") {
      parsedSize = parsedSize * 1000;
    } else if (unity == "Mo") {
      parsedSize = parsedSize * 1000000;
    } else if (unity == "Go") {
      parsedSize = parsedSize * 1000000000;
    } else if (unity == "To") {
      parsedSize = parsedSize * 1000000000000;
    }

    if (!name) {
      setError('Please enter a disk name');
      return;
    }

    if (parsedSize < 0) {
      setError('The size cannot be negative');
      return;
    }

    if (!regex(/^\d+([.,]\d{1,2})?$/, size) && unity != "o") {
      setError("The format of size is incorrect. It must have only chiffers and 1 or 2 chiffres after ',' because unity is not octect(s)");
      return;
    }

    if (!regex(/^\d*$/, size) && unity == "o") {
      setError("The format of size is incorrect. It must have only chiffers because unity is octect(s)");
      return;
    }

    try {
        console.log(parsedSize);
        console.log(countDecimals(parsedSize));
        const url = 'http://back:8078/utilisateurs';
        //const url = 'http://localhost:8080/utilisateurs';
      const usersRes = await fetch(url);
      const users = await usersRes.json();

      const index = users.findIndex((u: any) => u.email === username);
      if (index === -1) throw new Error('User not found');

      const url0 = 'http://back:8078/disques';
      //const url0 = 'http://localhost:8080/disques';
      await fetch(url0, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: name,
          espaceRestant: parsedSize,
          utilisateurId: users[index].id,
        }),
      });

      setSuccess(true);
      setTimeout(() => router.replace('/dashboard'), 1000);
    } catch (e: any) {
      setError('Failed to create disk object: ' + e.message);
    }
}
  }

  return (
    <View style={styles.body}>
      <Text style={styles.title}>Manage disk - New disk</Text>

      <TextInput
        placeholder="Disk name"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="Size (Mo)"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="decimal-pad"
          value={size}
          onChangeText={setSize}
        />
        <Picker
                    selectedValue={unity}
                    onValueChange={(itemUnity) => setUnity(itemUnity)}
                    >
                    <Picker.Item label="octect(s)" value="o" />
                    <Picker.Item label="Ko" value="Ko" />
                    <Picker.Item label="Mo" value="Mo" />
                    <Picker.Item label="Go" value="Go" />
                    <Picker.Item label="To" value="To" />
                    </Picker>
        </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>Disk created successfully!</Text> : null}

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={valider}>
          <Text style={styles.buttonText}>Validate (Click 3 times)</Text>
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
  title: {
    color: 'white',
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
