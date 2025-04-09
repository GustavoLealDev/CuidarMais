import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../Const/Colors';
import { useRouter } from 'expo-router';
import { auth } from '../../configs/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Cadastro() {
  const router = useRouter();

  const[email,setEmail]=useState();
  const[senha,setSenha]=useState();
 
  const CriarConta =()=>{

    if(!email || !senha){
      Alert.alert('Atenção', 'Preencha todos os campos');
      ToastAndroid.show('Preencha todos os campos',ToastAndroid.BOTTOM)
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      ToastAndroid.show('Conta criada com sucesso!',ToastAndroid.BOTTOM)
      router.push('TabNav')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      if(errorCode=='auth/invalid-email'){
        Alert.alert('Error', 'Esse email já está em uso!');
        ToastAndroid.show('Esse email já está em uso',ToastAndroid.BOTTOM)
      }
    });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Crie uma nova conta</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput 
          placeholder='Ex. João Silva' 
          style={styles.textInput}
          placeholderTextColor={Colors.GRAY}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          placeholder='Email' 
          style={styles.textInput}
          onChangeText={(value)=>setEmail(value)}
          placeholderTextColor={Colors.GRAY}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha</Text>
        <TextInput 
          placeholder='Senha' 
          secureTextEntry={true}
          style={styles.textInput}
          onChangeText={(value)=>setSenha(value)}
          placeholderTextColor={Colors.GRAY}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={CriarConta}
      >
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.buttonCreate}
        activeOpacity={0.8}
        onPress={()=>router.push('/Login/Entrar')}
      >
        <Text style={styles.buttonCreateText}>Ir para tela de Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: 'white',
    height: '100%',
  },
  textHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginTop: 30,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.GRAY,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: Colors.DARK,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  button: {
    padding: 18,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 30,
    marginTop: 30,
    elevation: 3,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  buttonCreate: {
    padding: 18,
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  buttonCreateText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
});