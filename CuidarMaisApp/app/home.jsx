import { Ionicons } from "@expo/vector-icons";
import Fontisto from '@expo/vector-icons/Fontisto';
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
    {
        icon: 'add-circle-outline',
        label: 'Nova\nMedicação',
        route: '/medications/add',
        color: '#98FF98',
        gradient: ['#6C63FF', "#4A42E6"],
    },
    {
        icon: 'calendar-outline',
        label: 'Calendário',
        route: '/calendar',
        color: '#98FF98',
        gradient: ['#FF7D7D', "#FF5252"],
    },
    {
        icon: 'time-outline',
        label: 'Historico',
        route: '/history',
        color: '#98FF98',
        gradient: ['#4D96FF', "#3578E5"],
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
                <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
                <Text style={styles.progressLabel}>{completedDoses} de {totalDoses} doses</Text>
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
                    <View style={styles.headerTop}>
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
                        progress={0.5}
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
                                            <Text style={styles.actionLabel}> {action.label}</Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Link>
                        ))}
                    </View>
                </View>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Programação diária</Text>
                    <Link href='/calender' asChild>
                        <TouchableOpacity>
                            <Text style={styles.seeAllButton}>Ver tudo</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {true ? (
                    <View style={styles.emptyState}>
                        <Fontisto name="pills" size={24} color="ccc" />
                        <Text style={styles.emptyStateText}>Nenhum medicamento agendado</Text>
                        <Link href='/medications/add' asChild>
                            <TouchableOpacity style={styles.addMedicationButton}>
                                <LinearGradient
                                    colors={['#6C63FF', '#4A42E6']}
                                    style={styles.addMedicationGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.addMedicationButtonText}>Adicionar medicamento</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Link>
                    </View>
                ) : (
                    [].map((medications) => {
                        return (
                            <View style={styles.doseCard}>
                                <View style={[
                                    styles.doseBadge, {
                                        backgroundColor: medications.color
                                    }
                                ]}>
                                    <Ionicons name='medical' size={24} />
                                </View>
                                <View style={styles.doseInfo}>
                                    <View>
                                        <Text styl={styles.medicineName}>Nome</Text>
                                        <Text style={styles.dosageInfo}>Dose</Text>
                                    </View>
                                    <View style={styles.doseTime}>
                                        <Ionicons name='time-outline' size={24} color='ccc' />
                                        <Text style={styles.timeText}>time</Text>
                                    </View>
                                </View>
                                {true ? (
                                    <View style={styles.takeDoseButton}>
                                        <Ionicons name='checkmark-circle-outline' size={24} />
                                        <Text style={styles.takeDoseText}>Tomar</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.takeDoseButton}>
                                        <Text style={styles.takeDoseText}>Tomar</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}
            </View>
            <Modal visible={true} transparent={true} animationType='slide'>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Notificação
                        </Text>
                        <TouchableOpacity style={styles.closeButton}>
                            <Ionicons name='close' size={24} color='#ccc' />
                        </TouchableOpacity>
                    </View>
                    {[].map((medications) => (
                        <View style={styles.notificationItem}>
                            <View style={styles.notificationIcon}>
                                <Ionicons name='medical' size={24} />
                            </View>
                            <View style={styles.notificationContent}>
                                <Text style={styles.notificationTitle}>Nome da medicação</Text>
                                <Text style={styles.notificationMessage}>Dosagem da medicação</Text>
                                <Text style={styles.notificationTime}>Horario da medicação</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Modal>
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
    headerTop: {
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
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 15,
    },
    actionButton: {
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
        borderRadius: 20,
    },
    actionLabel: {
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
    actionContent: {
        flex: 1,
        justifyContent: 'space-between'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    seeAllButton: {
        color: '#6C63FF', // Alterado para o mesmo tom de azul
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 16,
        marginTop: 10,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        marginBottom: 20,
    },
    addMedicationButton: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    addMedicationGradient: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addMedicationButtonText: {
        color: 'white',
        fontWeight: '600'
    },
    doseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    doseBadge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        marginRight: 15,
    },
    doseInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    medicineName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    dosageInfo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    doseTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        marginLeft: 5,
        color: '#666',
        fontSize: 14,
    },
    takeDoseButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginLeft: 10,
    },
    takeDoseText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    modalOverlay:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent:{
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    },
    closeButton: {
        padding: 5,
    },
    notificationContent:{
        flex: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        marginBottom: 10,
    }, 
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    notificationIcon:{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    notificationTime:{
        fontSize: 12,
        color: '#999',
    }
});