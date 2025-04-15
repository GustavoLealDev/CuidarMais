import { View, Text, Button } from 'react-native';
import React from 'react';
import { Redirect } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../configs/Firebase';

export default function Home() {
  return (
    <View>
      <Text>Home</Text>
      <Button title='Sair' onPress={()=> signOut(auth)}/>
    </View>
  );
}