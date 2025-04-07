import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function TabBar() {
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
            <FontAwesome name="user-plus" size={size} color={color} />
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