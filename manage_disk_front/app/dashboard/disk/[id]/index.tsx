import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // équivalent de window.location.pathname
  const [isLoading, setIsLoading] = useState(true);
  const [formatSize, setFormatSize] = useState('');
  const [username, setUsername] = useState<string | null>(null);

  const [disk, setDisk] = useState<{
    id: number;
    nom: string;
    espaceRestant: number;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');

        if (!storedUsername) {
          setIsLoading(false);
          return;
        }

        setUsername(storedUsername);

        const url = 'http://back:8078/disques';
        //const url = 'http://localhost:8080/disques';
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        const diskId = Number(id);
        const foundDisk = result.find((d: any) => d.id === diskId);

        if (!foundDisk) {
          router.replace('/dashboard');
          return;
        }

        setDisk(foundDisk);
        setIsLoading(false);
        if (foundDisk.espaceRestant < 1000) {
          setFormatSize(`${foundDisk.espaceRestant} octect(s)`);
        } else if (foundDisk.espaceRestant < 1000000) {
          setFormatSize(`${(foundDisk.espaceRestant / 1000).toFixed(2)} Ko`);
        } else if (foundDisk.espaceRestant < 1000000000) {
          setFormatSize(`${(foundDisk.espaceRestant / 1000000).toFixed(2)} Mo`);
        } else if (foundDisk.espaceRestant < 1000000000000) {
          setFormatSize(`${(foundDisk.espaceRestant / 1000000000).toFixed(2)} Go`);
        } else {
          setFormatSize(`${(foundDisk.espaceRestant / 1000000000000).toFixed(2)} To`);
        }
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (!isLoading && !username) {
    return <Redirect href="/login" />;
  }

  const options = Array.from({ length: 28 }, (_, n) => ({
    n,
    value: poly(n),
  }));
  function formatStorage(ko: number): string {
    if (ko >= 1_000_000_000_000) {
      return `${ko / 1_000_000_000_000} To`;
    }
    if (ko >= 1_000_000_000) {
      return `${ko / 1_000_000_000} Go`;
    }
    if (ko >= 1_000_000) {
      return `${ko / 1_000_000} Mo`;
    }
    if (ko >= 1_000) {
      return `${ko / 1_000} Ko`;
    }
    return `${ko} octects`;
  }

  function confirmSecu(x:number){
    if (Platform.OS == "web"){
      const conf = confirm("Do you want to win "+formatStorage(x)+" ?")
      if (conf){
        securiser(x)
      }
    }
    Alert.alert(
          'Win',
          "Do you want to win "+formatStorage(x)+" ?",
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', onPress: () => securiser(x) },
          ]
        );
  }

  const securiser = async(x:number) => {
    try{
      //const url = "http://localhost:8080/disques/"+id+"/operations";
      const url = "http://back:8078/disques/"+id+"/operations";
    await fetch(url,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:"remove",
          valeur:x
        })
      })
      if (Platform.OS == "web"){
        alert("Securizing "+formatStorage(x)+" successfully !")
        router.replace(`/dashboard/disk/${id}`)
      }
      Alert.alert(
          'Success',
          "Securizing "+formatStorage(x)+" successfully !",
          [
            { text: 'OK', onPress: () => router.replace(`/dashboard/disk/${id}`) },
          ]
        );
      }catch(error){
        if (Platform.OS == "web"){
          alert("Failed to securize the space : "+error)
        }
        Alert.alert(
          'Failed',
          "Failed to securize the space : "+error,
          [
            { text: 'OK', style: 'cancel' },
          ]
        );
      }
  }


  function poly(x:number){
    if (x < 0)return -999999999999;
    return 1500
    * Math.pow(2, x)
    * Math.pow(1.25, Math.floor((x + 1) / 3));
  }

  if (isLoading || !disk) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.body}>
      <Text style={styles.title}>Manage disk - Disk informations</Text>

      <View style={styles.row}>
        <Text style={styles.label}>ID :</Text>
        <Text style={styles.value}>{disk.id}</Text>

        <Text style={styles.label}>Name :</Text>
        <Text style={styles.value}>{disk.nom}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Left space :</Text>
        <Text style={styles.value}>{formatSize}</Text>
      </View>
      {options
      .filter(o => disk.espaceRestant >= o.value)
      .map(o => (
        <Pressable key={o.n} style={styles.button} onPress={() => confirmSecu(o.value * 2/3)}>
          <Text>I want to securize {formatStorage(o.value * 2/3)}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.button} onPress={() => router.push(`/dashboard/disk/${id}/file/edit`)}>
        <Text>I have put or remove a file on this disk.</Text>
        </Pressable>
      <Pressable style={styles.button} onPress={() => router.push(`/dashboard/disk/${id}/edit`)}>
        <Text>Edit informations</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push('/dashboard')}>
        <Text>Return to dashboard</Text>
        </Pressable>
    </ScrollView>
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    color: 'white',
    marginRight: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 6,
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});