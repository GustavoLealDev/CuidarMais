import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import Colors from '../../Const/Colors';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router=useRouter();
  return (
    <View>
    <View style={styles.container}>
      <View style={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <Image 
        source={require('../../assets/images/Cuidar+.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      </View>
      
      <Text style={styles.title}>
        Fique Saudável!!
      </Text>
      
      <Text style={styles.subtitle}>
        "Monitore seus remédios, controle sua saúde, mantenha a consistência, mantenha a confiança"
      </Text>

      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText} onPress={()=>router.push('/Login/Entrar')}>
          Continuar
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>
        Ao clicar em 'Continuar', você concorda com nossos
        <Text style={styles.underlineText} > termos e condições</Text>.
      </Text>
    </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 40,
        backgroundColor: Colors.PRIMARY,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 350,
        height: 350, 
        marginBottom: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 15
    },
    subtitle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 30,
        paddingHorizontal: 20,
        fontStyle: 'italic'
    },
    button: {
        padding: 18,
        backgroundColor: 'white',
        borderRadius: 30,
        width: '80%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.PRIMARY,
        fontWeight: '600'
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: 20,
        textAlign: 'center',
        fontSize: 12,
        width: '80%'
    },
    underlineText: {
        textDecorationLine: 'underline',
      }
})