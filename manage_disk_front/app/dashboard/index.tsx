import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [disks, setDisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
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

      setUser({
        ...currentUser,
        password: '*'.repeat(currentUser.password.length),
      });

      //const url0 = 'http://localhost:8080/disques';
      const url0 = 'http://back:8078/disques';
      const disksRes = await fetch(url0);
      const allDisks = await disksRes.json();

      setDisks(allDisks.filter((d: any) => d.utilisateur.email === username));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (Platform.OS === 'web') {
        const conf = window.confirm('Are you sure to logout ?');
        if (conf) {
            await AsyncStorage.removeItem('username');
            router.replace('/login');
        }
        return;
    }

    Alert.alert('Disconnect', 'Are you sure ?', [
        { text: 'Cancel', style: 'cancel' },
        {
        text: 'Yes',
        onPress: async () => {
            await AsyncStorage.removeItem('username');
            router.replace('/login');
        },
        },
    ]);
    }

  async function deleteDisk(id: number) {
    if (Platform.OS === 'web') {
        const conf = window.confirm('Are you sure to delete the disk n°'+id+' ?');
        if (conf) {
          //const url = `http://localhost:8080/disques/${id}`;
          const url = `http://back:8078/disques/${id}`;
            await fetch(url, {
                method: 'DELETE',
            });
            loadData();
        }
        return;
    }
    Alert.alert('Delete disk', `Delete disk ${id} ?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          //const url = `http://localhost:8080/disques/${id}`;
          const url = `http://back:8078/disques/${id}`;
          await fetch(url, {
            method: 'DELETE',
          });
          loadData();
        },
      },
    ]);
  }

  if (!logged) return <Redirect href="/login" />;
  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.body}>
      <Text style={styles.title}>Manage disk - Dashboard</Text>

      <Text style={styles.section}>Your informations</Text>
      <Text style={styles.blanc}>Email : {user.email}</Text>
      <Text style={styles.blanc}>First name : {user.nom}</Text>
      <Text style={styles.blanc}>Last name : {user.prenom}</Text>
      <Text style={styles.blanc}>Password : {user.password}</Text>

      <Pressable style={styles.button} onPress={() => router.push('/dashboard/edit')}>
        <Text>Edit informations</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => logout()}>
        <Text>Disconnect</Text>
      </Pressable>

      <Text style={styles.section}>Your disks</Text>

      {disks.map(d => (
        <View key={d.id} style={styles.disk}>
          <Text style={styles.blanc}>ID: {d.id}</Text>
          <Text style={styles.blanc}>Name: {d.nom}</Text>

          <Pressable onPress={() => router.push(`/dashboard/disk/${d.id}`)}>
            <Text style={styles.link}>More informations</Text>
          </Pressable>

          <Pressable onPress={() => deleteDisk(d.id)}>
            <Text style={styles.delete}>Delete</Text>
          </Pressable>
        </View>
      ))}

      <Text>Total disks: {disks.length}</Text>

      <Pressable style={styles.button} onPress={() => router.push('/dashboard/disk/new')}>
        <Text>Create new disk</Text>
      </Pressable>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    blanc:{
        color:'white',
    },
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
  section: {
    color: 'white',
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 6,
    alignItems: 'center',
  },
  disk: {
    borderWidth: 1,
    borderColor: '#666',
    padding: 10,
    marginVertical: 6,
  },
  link: {
    color: '#4ea1ff',
  },
  delete: {
    color: 'red',
  },
  loading: {
    color: 'white',
    marginTop: 50,
    textAlign: 'center',
  },
});
