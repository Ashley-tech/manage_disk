import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text, TextInput,
  View
} from 'react-native';

export default function HomeScreen() {
      const router = useRouter();
      const { id } = useLocalSearchParams(); // équivalent de window.location.pathname
    
      const [diskData, setDiskData] = useState({
        nom:'',
        espaceRestant:'',
      });

      const [username, setUsername] = useState<string | null>(null);

      const [isLoading, setIsLoading] = useState(true);
        const [unity, setUnity] = useState("o");

      const [messages, setMessages] = useState({
                mismatch: false,
                error: '',
                success: false,
                negative: false,
        });

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

        const url = 'http://back:8078/disques';
        //const url = 'http://localhost:8080/disques';
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        const index = result.findIndex((u: any) => u.id == id);

        if (index !== -1) {
          setDiskData({
            nom: result[index].nom,
            espaceRestant: String(result[index].espaceRestant),
          });
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

  function countDecimals(num: number) {
    const parts = num.toString().split('.');
    return parts[1]?.length ?? 0;
  }

  const update = async () => {
    setMessages({
      mismatch: false,
      error: '',
      success: false,
      negative: false,
    });
    if (!regex(/^\d+([.,]\d{1,2})?$/, diskData.espaceRestant) && diskData.espaceRestant != '' && unity != "o") {
        setMessages(prev => ({ ...prev, mismatch: true }));
        return;
    }
    if (unity == "o" && !regex(/^\d*$/, diskData.espaceRestant) && diskData.espaceRestant != '') {
        setMessages(prev => ({ ...prev, mismatch: true }));
        return;
    }
    let valeur = parseFloat(diskData.espaceRestant.replace(',', '.'));
    if (valeur < 0) {
        setMessages(prev => ({ ...prev, negative: true }));
        return;
    }
    if (countDecimals(valeur) > 2 && unity != "o") {
        setMessages(prev => ({ ...prev, mismatch: true }));
        return;
    }
    if (unity == "Ko") {
        valeur = valeur * 1000;
    } else if (unity == "Mo") {
        valeur = valeur * 1000000;
    } else if (unity == "Go") { 
        valeur = valeur * 1000000000;
    } else if (unity == "To") {
        valeur = valeur * 1000000000000;
    }
    try {
        const request = {
                nom: diskData.nom,
                espaceRestant: valeur,
            }

            if (diskData.espaceRestant === '') {
                request.espaceRestant = 0;
            }
            const url = `http://back:8078/disques/${id}`;
            //const url = `http://localhost:8080/disques/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        const result = await response.json();
        setMessages(prev => ({ ...prev, success: true }));
        setTimeout(() => router.push(`/dashboard/disk/${id}`), 1000);
    } catch(e){
        setMessages(prev => ({ ...prev, error: 'Failed to edit disk: ' + (e as Error).message }));
        return;
    }
  }

  function regex(reg: RegExp, str: string) {
      return reg.test(str);
    }

      const cancel = () => {
          if (Platform.OS === 'web') {
              const conf = window.confirm('Are you sure to cancel the edit ?');
              if (conf) {
                  router.push(`/dashboard/disk/${id}`);
              }
          }
          Alert.alert(
            'Cancel',
            'Are you sure to cancel the edit ?',
            [
              { text: 'No', style: 'cancel' },
              { text: 'Yes', onPress: () => router.push(`/dashboard/disk/${id}`) },
            ]
          );
        };
        
      return (
        <View style={styles.body}>
          <Text style={styles.title}>Manage disk - Edit the disk</Text>
    
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Name :</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#999"
                value={diskData.nom}
                onChangeText={(text) =>
                  setDiskData({ ...diskData, nom: text })
                }
              />
            </View>
    
            <View style={styles.field}>
              <Text style={styles.label}>Size :</Text>
              <TextInput
                style={styles.input}
                placeholder="Size (Mo)"
                placeholderTextColor="#999"
                value={diskData.espaceRestant}
                onChangeText={(text) =>
                  setDiskData({ ...diskData, espaceRestant: text })
                }
                
              /><Picker
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
          </View>
    
    
          {messages.negative && <Text style={{ ...styles.rouge }}>The left stockage cannot be negative.</Text>}
                      {messages.success && <Text style={{ ...styles.vert }}>Editing successful.</Text>}
                      {messages.mismatch && <Text style={{ ...styles.rouge }}>The format of size is incorrect. If unity is octet, the size must have only chiffers, else it must have only chiffers and 1 or 2 chiffres after ','</Text>}
                      {messages.error && <Text style={{ ...styles.rouge }}>{messages.error}</Text>}
    
          <View style={styles.buttons}>
            
            <Pressable style={styles.button} onPress={update}>
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
