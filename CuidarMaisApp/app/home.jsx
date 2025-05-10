import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
    {
        icon: 'add-circle-outline',
        label: 'Nova\nMedicação',
        route: '/medications/add',
        color: '#98FF98',
        gradient: ['#4CAF50', "#2E7D32"],
    },
    {
        icon: 'calendar-outline',
        label: 'Calendário',
        route: '/calendar',
        color: '#98FF98',
        gradient: ['#4CAF50', "#2E7D32"],
    },
];

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
        <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
                <Text styles={styles.progressPercentage}>{Math.round(progress)}%</Text>
                <Text style={styles.progressLabel}>{completedDoses} de {totalDoses} Doses</Text>
            </View>
            <Svg width={size} height={size} style={styles.progressRing}>
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
    const router = useRouter();
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <LinearGradient colors={["#243560", "#243560"]} style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.hearderTop}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.greeting}>Progresso Diario</Text>
                        </View>
                        <TouchableOpacity style={styles.notificationButton}>
                            <Ionicons name='notifications-outline' size={24} color="white" />
                            {<View style={styles.notificationBadge}>
                                <Text style={styles.notificationCount}></Text>
                            </View>}
                        </TouchableOpacity>
                    </View>
                    <CircularProgress
                        progress={50}
                        totalDoses={10}
                        completedDoses={5}
                    />
                </View>
            </LinearGradient>
            <View style={styles.content}>
                <View style={styles.quickActionsContainer}>
                    <Text style={styles.sectionTitle}>Ações</Text>
                    <View style={styles.quickActionsGrid}>
                        {QUICK_ACTIONS.map((action) => (
                            <Link href={action.route} key={action.label} asChild>
                                <TouchableOpacity style={styles.actionButton}>
                                    <LinearGradient colors={action.gradient} style={styles.actionGradient}>
                                        <View style={styles.actionContent}>
                                            <View style={styles.actionIcon}>
                                                <Ionicons name={action.icon} size={24} color={'white'} />
                                            </View>
                                            <Text>
                                                {action.label}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Link>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 50,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    hearderTop: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        opacity: 0.9,
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    notificationButton: {
        position: 'relative',
        padding: 8,
        backgroundColor: 'rgba(255,255,255, 0.15)',
        borderRadius: 12,
        marginLeft: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ff5252',
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        minWidth: 20,
        borderColor: '#146922',
    },
    notificationCount: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'white'
    },
    progressDetails: {
        fontSize: 11,
        color: 'white',
        fontWeight: 'bold',
    },
    progressTextContainer: {
        position: 'absolute',
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    progressPercentage: {
        fontSize: 36,
        color: 'white',
        fontWeight: 'bold',
    },
    progressLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: 'bold'
    },
    progressRing: {
        transform: [{ rotate: '-90deg' }],
    }, 
    quickActionsContainer: {
        paddingHorizontal: 20,
        marginBottom: 25
    }, 
    quickActionsGrid:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 15,
    },
    actionButton:{
        width: (width - 52) / 2,
        height: 110,
        borderRadius: 16,
        overflow: 'hidden',
    },
    actionGradient: {
        flex: 1,
        padding: 15,
    },
    actionIcon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel:{
        fontSize: 14,
        color: 'white',
        fontWeight: '600',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 5,
    },
    actionContent:{
        flex: 1, 
        justifyContent: 'space-between'
    }
});