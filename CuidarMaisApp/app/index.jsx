// Importação de componentes e bibliotecas necessárias
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function Screen() {
    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(0.5)).current;
    const router = useRouter();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }), 
            Animated.spring(scaleAnimation, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();
        const timer = setTimeout(() => {
            router.replace('/auth');
        }, 3000);
        return function cleanup() {
            clearTimeout(timer);
        };
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.iconContainer, {
                    opacity: fadeAnimation,
                    transform: [{ scale: scaleAnimation }]
                }
            ]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.AppName}>Cuidar</Text>
                    <FontAwesome name="plus" size={50} color="white" />
                </View>
            </Animated.View>
        </View>
    );
}

// Estilos do componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4361EE',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
       alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    AppName: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold', 
        marginRight: 10,
        letterSpacing: 1,
    }
});