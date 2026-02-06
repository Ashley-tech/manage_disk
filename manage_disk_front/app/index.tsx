import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [route, setRoute] = useState<"/dashboard" | "/login" | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (username && username.trim() !== '') {
          setRoute("/dashboard");
        } else {
          setRoute("/login");
        }
      } catch (error) {
        setRoute("/login");
      }
    };
    checkAuth();
  }, []);

  if (!route) return null;
  return <Redirect href={route} />;
}