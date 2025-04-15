import { View, Text } from 'react-native';
import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../configs/Firebase';


export default function TabBar() {
  
  const router=useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(uid)
      // ...
    } else {
      router?.push('/Login')
      // User is signed out
      // ...
    }
  })
  
  return (
    <Tabs screenOptions={{
      headerShown: false
    }}>
        <Tabs.Screen name='index'
          options={{
            tabBarLabel:'Home',
            tabBarIcon:({color,size})=>(
              <FontAwesome name="home" size={size} color={color} />
            )
          }}
        ></Tabs.Screen>  
        <Tabs.Screen name='Add'
        options={{
          tabBarLabel:'Adicionar',
          tabBarIcon:({color,size})=>(
            <AntDesign name="pluscircle" size={24} color="black" />
          )
        }}>
        </Tabs.Screen>
        <Tabs.Screen name='Profile'
        options={{
          tabBarLabel:'Perfil',
          tabBarIcon:({color,size})=>(
            <FontAwesome name="user-circle" size={size} color={color} />
          )
        }}>

        </Tabs.Screen>
    </Tabs>
  );
}