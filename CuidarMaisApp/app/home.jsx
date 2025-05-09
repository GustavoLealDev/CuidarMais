import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

function CircularProgress({ progress, totalDoses, completedDoses }) {
    const animationValue = useRef(new Animated.Value(0)).current;
    const size = width * 0.55;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: progress,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [progress]);

    const strokeDashoffset = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    return (
        <View>
            <View>
                <Text>{Math.round(progress)}%</Text>
                <Text>{completedDoses} de {totalDoses} Doses</Text>
            </View>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="white"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
        </View>
    );
}

export default function HomeScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={["#243560", "#243560"]}>
                <View>
                    <View>
                        <View style={{ flex: 1 }}>
                            <Text>Progresso Diario</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name='notifications-outline' size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <CircularProgress
                        progress={50}
                        totalDoses={10}
                        completedDoses={5}
                    />
                </View>
            </LinearGradient>
        </ScrollView>
    );
}