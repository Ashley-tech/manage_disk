import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [emailID, setEmailID] = useState<number | null>(null);

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'email' | 'password'>('email');

  async function checkEmail() {
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('You must enter an email address.');
      return;
    }

    try {
      //const url = 'http://localhost:8080/utilisateurs';
      const url = 'http://back:8078/utilisateurs';
      const response = await fetch(url);
      const users = await response.json();

      const user = users.find((u: any) => u.email === email);

      if (!user) {
        setError('Email address not found.');
        return;
      }

      setEmailID(user.id);
      setStep('password');
    } catch (e) {
      setError('Error checking email.');
    }
  }

  async function changePassword() {
    setError('');
    setSuccess('');

    if (!password || !password2) {
      setError('You must enter a new password.');
      return;
    }

    if (password !== password2) {
      setError('The passwords do not match.');
      return;
    }

    try {
      //const url = `http://localhost:8080/utilisateurs/${emailID}/forgot-password`;
      const url = `http://back:8078/utilisateurs/${emailID}/forgot-password`;
      await fetch(
        url,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );

      setSuccess('Password changed successfully.');
      setTimeout(() => router.replace('/login'), 1000);
    } catch (e) {
      setError('Error changing password.');
    }
  }

  return (
    <View style={styles.body}>
      <Text style={styles.title}>Manage disk - Forgot password</Text>

      {step === 'email' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />

          <Pressable style={styles.button} onPress={checkEmail}>
            <Text style={styles.buttonText}>Check Email</Text>
          </Pressable>

          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Return to login</Text>
          </Pressable>
        </>
      )}

      {step === 'password' && (
        <>
          <Text style={styles.label}>{email}</Text>

          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="New password"
              placeholderTextColor="#999"
              secureTextEntry={!showPwd}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPwd(!showPwd)}>
              <Text style={styles.link}>Show</Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              secureTextEntry={!showPwd2}
              value={password2}
              onChangeText={setPassword2}
            />
            <Pressable onPress={() => setShowPwd2(!showPwd2)}>
              <Text style={styles.link}>Show</Text>
            </Pressable>
          </View>

          <Pressable style={styles.button} onPress={changePassword}>
            <Text style={styles.buttonText}>Change password</Text>
          </Pressable>

          <Pressable onPress={() => setStep('email')}>
            <Text style={styles.link}>Cancel</Text>
          </Pressable>
        </>
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!success && <Text style={styles.success}>{success}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: 'white',
    fontSize: 22,
    marginBottom: 20,
  },
  label: {
    color: 'white',
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
  button: {
    backgroundColor: 'white',
    padding: 12,
    width: 260,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
  },
  link: {
    color: '#4ea1ff',
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginTop: 12,
  },
  success: {
    color: 'green',
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
