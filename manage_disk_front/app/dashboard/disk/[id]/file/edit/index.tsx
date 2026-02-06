import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditFileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [unity, setUnity] = useState("o");
        const [formatSize, setFormatSize] = useState('');
  const [messages, setMessages] = useState({
                  incorrect: false,
                  error: '',
                  success: false,
                  negative: false,
          });
          const [size, setSize] = useState('');
          useEffect(() => {
            const fetchData = async () => {
              try {
                const url = 'http://back:8078/disques';
                //const url = 'http://localhost:8080/disques';
                const response = await fetch(url);
                const result = await response.json();
                const index = result.findIndex((d: any) => d.id == id);
                let unityP = "o";
                if (result[index].espaceRestant >= 1000000000000) {
                  setFormatSize(`Left space : ${(result[index].espaceRestant / 1000000000000).toFixed(2)} To`);
                    unityP = "To";
                } else if (result[index].espaceRestant >= 1000000000) {
                  setFormatSize(`Left space : ${(result[index].espaceRestant / 1000000000).toFixed(2)} Go`);
                    unityP = "Go";
                } else if (result[index].espaceRestant >= 1000000) {
                  setFormatSize(`Left space : ${(result[index].espaceRestant / 1000000).toFixed(2)} Mo`);
                    unityP = "Mo";
                } else if (result[index].espaceRestant >= 1000) {
                  setFormatSize(`Left space : ${(result[index].espaceRestant / 1000).toFixed(2)} Ko`);
                    unityP = "Ko";
                } else {
                  setFormatSize(`Left space : ${result[index].espaceRestant} octet(s)`);
                    unityP = "o";
                }
                setDiskData({
                    nom: result[index].nom,
                    espaceRestant: result[index].espaceRestant,
                });
              } catch (error) {
                console.error('Error fetching disk data:', error);
              }
            }
            fetchData();
          })

          const [diskData, setDiskData] = useState({
                  nom:'',
                  espaceRestant:'',
                });

    const update = async(type: string) =>{
        setMessages({
            incorrect: false,
            error: '',
            success: false,
            negative: false,
        });
        if ((!regex(/^\d+([.,]\d{1,2})?$/, size) && size != '' && unity != "o") || (unity == "o" && !regex(/^\d+$/, size) && size != '') || size == '') {
            setMessages(prev => ({ ...prev,  incorrect: true }));
            return;
        }
        const requestP = {
            valeur: parseFloat(size.replace(',', '.')),
            type: type,
        }
        console.log(requestP);
        console.log(requestP.valeur.toString())

        const url = 'http://back:8078/disques';
        //const url = 'http://localhost:8080/disques';
        const response = await fetch(url);
        const result = await response.json();
        const index = result.findIndex((d: any) => d.id == id);
        let unityP = "o";
        if (result[index].espaceRestant >= 1000000000000) {
            unityP = "To";
        } else if (result[index].espaceRestant >= 1000000000) {
            unityP = "Go";
        } else if (result[index].espaceRestant >= 1000000) {
            unityP = "Mo";
        } else if (result[index].espaceRestant >= 1000) {
            unityP = "Ko";
        }
        console.log("Current unity : " + unityP);

        switch (unityP){
          case "To":
            if (unity != "To"){
              switch (unity){
                case "Go":
                  requestP.valeur = requestP.valeur / 1000;
                  break;
                case "Mo":
                  requestP.valeur = requestP.valeur / 1000000;
                  break; 
                case "Ko":
                  requestP.valeur = requestP.valeur / 1000000000;
                  break;
                case "o":
                  requestP.valeur = requestP.valeur / 1000000000000;
                  break;
                default:
                  break;
              }
            }
            break;
          case "Go":
            if (unity != "Go"){
              if (unity == "To"){
                requestP.valeur = requestP.valeur * 1000;
              }else {
                switch (unity){
                  case "Mo":
                    requestP.valeur = requestP.valeur / 1000;
                    break;
                  case "Ko":
                    requestP.valeur = requestP.valeur / 1000000;
                    break;
                  case "o":
                    requestP.valeur = requestP.valeur / 1000000000;
                    break;
                  default:
                    break;
                }
              }
            }
            break;
          case "Mo":
            if (unity != "Mo"){
              switch (unity){
                case "To":
                  requestP.valeur = requestP.valeur * 1000000;
                  break;
                case "Go":
                  requestP.valeur = requestP.valeur * 1000;
                  break;
                case "Ko":
                  requestP.valeur = requestP.valeur / 1000;
                  break;
                case "o":
                  requestP.valeur = requestP.valeur / 1000000;
                  break;
                default: break;
              }
            }
            break;
          case "Ko":
            if (unity != "Ko"){
              switch (unity){
                case "To":
                  requestP.valeur = requestP.valeur / 1000000;
                  break;
                case "Go":
                  requestP.valeur = requestP.valeur / 1000;
                  break;
                case "Mo":
                  requestP.valeur = requestP.valeur * 1000;
                  break;
                case "o":
                  requestP.valeur = requestP.valeur / 1000000;
                  break;
                default: break;
              }
            }
            break;
          case "o":
            if (unity != "o"){
              switch (unity){
                case "To":
                  requestP.valeur = requestP.valeur * 1000000000000;
                  break;
                case "Go":
                  requestP.valeur = requestP.valeur * 1000000000;
                  break;
                case "Mo":
                  requestP.valeur = requestP.valeur * 1000000;
                  break;
                case "Ko":
                  requestP.valeur = requestP.valeur * 1000;
                  break;
                default: break;
              }
            }
            break;
        }
        if (type == "remove"){
          requestP.valeur = auCentiemeMax(requestP.valeur);
        }else {
          requestP.valeur = auCentiemeMin(requestP.valeur);
        }
        if (unityP == "To"){
          requestP.valeur = requestP.valeur * 1000000000000;
        } else if (unityP == "Go"){
          requestP.valeur = requestP.valeur * 1000000000;
        } else if (unityP == "Mo"){
          requestP.valeur = requestP.valeur * 1000000;
        } else if (unityP == "Ko"){
          requestP.valeur = requestP.valeur * 1000;
        } else {
          requestP.valeur = requestP.valeur;
        }
        if (requestP.valeur > parseFloat(diskData.espaceRestant) && type == "remove"){
          setMessages(prev => ({ ...prev,  negative: true }));
          return;
        }
        if (unityP == "To"){
          console.log("Value after conversion : " + (requestP.valeur / 1000000000000).toString() + " To");
        } else if (unityP == "Go"){
          console.log("Value after conversion : " + (requestP.valeur / 1000000000).toString() + " Go");
        } else if (unityP == "Mo"){
          console.log("Value after conversion : " + (requestP.valeur / 1000000).toString() + " Mo");
        } else if (unityP == "Ko"){
          console.log("Value after conversion : " + (requestP.valeur / 1000).toString() + " Ko");
        } else {
          console.log("Value after conversion : " + requestP.valeur.toString()+ " ("+formatSize+")");
        }
        console.log(requestP);
        if (type == "remove"){
          console.log("New left space (octect) : " + diskData.espaceRestant + " - " + requestP.valeur + " = " + (parseFloat(diskData.espaceRestant) - requestP.valeur));
        } else {
          console.log("New left space (octect) : " + diskData.espaceRestant + " + " + requestP.valeur + " = " + (parseFloat(diskData.espaceRestant) + requestP.valeur));
        }
        try {
          const url = `http://back:8078/disques/${id}/operations`
          //const url = `http://localhost:8080/disques/${id}/operations`
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestP),
          });
          const result = await response.json();
          if (response.ok) {
            setMessages(prev => ({ ...prev,  success: true }));
            const newEspaceRestant = type == "remove" ? parseFloat(diskData.espaceRestant) - requestP.valeur : parseFloat(diskData.espaceRestant) + requestP.valeur;
            setDiskData(prev => ({ ...prev, espaceRestant: newEspaceRestant.toString() }));
            setSize('');
            setUnity('o');
          } else {
            setMessages(prev => ({ ...prev,  error: result.message || 'An error occurred while updating the file size.' }));
          }
        } catch (error) {
          console.error("Error updating file:", error);
        }
    }

    function auCentiemeMin(valeur: number): number {
        return Math.floor(valeur * 100) / 100;
    }

    function auCentiemeMax(valeur: number): number {
        return Math.ceil(valeur * 100) / 100;
    }

    function countDecimals(num: number) {
        const parts = num.toString().split('.');
        return parts[1]?.length ?? 0;
    }
    function regex(pattern: RegExp, value: string) {
        return pattern.test(value);
    }

  function cancel(){
    if (Platform.OS == 'web') {
        const confirm = window.confirm('Are you sure to cancel file edit ?');
        if (confirm) {
            router.replace(`/dashboard/disk/${id}`);
        }
    }
    Alert.alert(
      'Cancel',
      'Are you sure to cancel file edit ?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => router.replace(`/dashboard/disk/${id}`) },
      ]
    );
  }
  return(
    <View style={styles.body}>
        <Text style={styles.title}>Manage disk - What is the size of your file ?</Text>
        <Text style={styles.value}>{formatSize}</Text>
        <View style={styles.row}>
                <TextInput
                                style={styles.input}
                                placeholder="Size"
                                value={size}
                                onChangeText={(text) => setSize(text)}
                                placeholderTextColor="#999"
                              />
                <Picker
                    selectedValue={unity}
                    onValueChange={(itemUnity) => setUnity(itemUnity)}
                    >
                        <Picker.Item label="octet(s)" value="o" />
                        <Picker.Item label="Ko" value="Ko" />
                    <Picker.Item label="Mo" value="Mo" />
                    <Picker.Item label="Go" value="Go" />
                    <Picker.Item label="To" value="To" />
                    </Picker>
                                </View>
                                {messages.incorrect && (
                                    <Text style={styles.error}>Incorrect value. It must be a positive number no empty and have at most 2 decimals if size is not octect and no deciman if size is octect.</Text>
                                )}
                                {messages.error != '' && (
                                    <Text style={styles.error}>{messages.error}</Text>
                                )}
                                {messages.success && (
                                    <Text style={styles.success}>File size updated successfully.</Text>
                                )}
                                {messages.negative && (
                                    <Text style={styles.error}>Not enough space on the disk to add this file size.</Text>
                                )}
              <View style={styles.buttons}>
                          
                          <Pressable style={styles.button}>
                            <Text style={styles.buttonText} onPress={() => update("remove")}>I have added this file</Text>
                          </Pressable>
                          <Pressable style={styles.button}>
                            <Text style={styles.buttonText} onPress={() => update("add")}>I have removed this file</Text>
                          </Pressable>
                  
                          <Pressable style={styles.button} onPress={cancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                          </Pressable>
                        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
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
    paddingBottom: 10,
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
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    color: 'black',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
});