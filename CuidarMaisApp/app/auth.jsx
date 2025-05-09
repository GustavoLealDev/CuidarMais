// Importações de bibliotecas e componentes necessários
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Componente principal da tela de autenticação
export default function AuthScreen() {
  // Verifica se dispositivo tem biometria
  const [hasBiometrics, setHasBiometrics] = useState(false);
  // Estado durante autenticação
  const [isAuthentication, setIsAuthentication] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkBiometrics();
  }, []);

   // Função para verificar se o dispositivo suporta autenticação biométrica
  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(hasHardware && isEnrolled);
  }

   // Função para realizar a autenticação
  const authenticate = async () => {
    try {
      setIsAuthentication(true);
      setError(null);

       // Verifica novamente as capacidades do dispositivo
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync

      // Inicia o processo de autenticação
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage : hasHardware && isEnrolled 
        ? "Use Face ID, Touch ID ou senha para acessar seus medicamentos" 
        : "Digite sua senha para ver seus remédios",
        fallbackLabel: 'Use a SENHA',
        cancelLabel: 'Voltar',
        disableDeviceFallback: false,
      });

      // Se autenticação for bem sucedida, navega para homeScreen
      if(auth.success){
        router.replace('/home')
      } else {
        setError('Autenticação falhou: Tente novamente!!')
      }

    } catch (error) { }
  };

  return (
    <LinearGradient
      colors={["#243560", "#1a2845"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="pills" size={60} color="white" />
        </View>

        <Text style={styles.title}>Cuidar +</Text>
        <Text style={styles.subtitle}>Seu alerta de medicamentos pessoal</Text>

        <View style={styles.card}>
          <Text style={styles.welcomeText}>Bem-vindo!!</Text>
          <Text style={styles.instructionText}>
            {hasBiometrics
              ? "Use Face ID, Touch ID ou senha para acessar seus medicamentos"
              : "Digite sua senha para ver seus remédios"}
          </Text>

          <TouchableOpacity style={[styles.authButton, isAuthentication && styles.buttonDisable]} 
          onPress={authenticate}
          disabled={isAuthentication}>
            <Ionicons
              name={hasBiometrics ? 'finger-print' : 'keypad'}
              size={24}
              color={'#243560'}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {isAuthentication ? 'Verificando...' : hasBiometrics ? 'Autenticar' : 'Entrar com senha'}
            </Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name='alert-circle' size={20} color={'#f44336'} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    height: 120,
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 40,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 22
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: width - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#243560',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(36, 53, 96, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(36, 53, 96, 0.3)'
  },
  buttonIcon: {
    marginRight: 10
  },
  buttonText: {
    color: '#243560',
    fontWeight: '600',
    fontSize: 16
  },
  buttonDisable: {
    opacity: 0.7,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)'
  },
  errorText: {
    color: '#f44336',
    marginLeft: 8,
    fontSize: 14
  }
});