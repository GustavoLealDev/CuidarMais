// Importação de componentes e bibliotecas necessárias
import { Ionicons } from "@expo/vector-icons";
import Fontisto from '@expo/vector-icons/Fontisto';
import { LinearGradient } from "expo-linear-gradient";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, AppState, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from 'react-native-svg';
import { registerNotificationsAsync } from "../utils/notifications";
import { getMedication, getTodaysDoses, recordDose, sheduleMedicationReminder } from "../utils/storage";

const { width } = Dimensions.get('window');

// Cores principais do tema
const COLORS = {
    primary: '#4361EE',
    secondary: '#3A0CA3',
    accent: '#4CC9F0',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#F87171',
    background: '#F8FAFC',
    text: '#1E293B',
    textLight: '#64748B',
    white: '#FFFFFF',
    card: '#FFFFFF',
};

const QUICK_ACTIONS = [
    {
        icon: 'add-circle-outline',
        label: 'Nova\nMedicação',
        route: '/medicacoes/add',
        gradient: [COLORS.primary, COLORS.secondary],
    },
    {
        icon: 'calendar-outline',
        label: 'Calendário',
        route: '/calendar',
        gradient: [COLORS.accent, '#3A86FF'],
    },
    {
        icon: 'time-outline',
        label: 'Historico',
        route: '/history',
        gradient: [COLORS.success, '#10B981'],
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
                    stroke={COLORS.white}
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
    const [todaysMedications, setTodaysMedications] = useState([]);
    const [completedDoses, setCompletedDoses] = useState(0);
    const [doseHistory, setDoseHistory] = useState([]);
    const [medications, setMedications] = useState([]);

    const loadMedications = useCallback(async () => {
        try {
            const [allMedications, todaysDoses] = await Promise.all([
                getMedication(),
                getTodaysDoses(),
            ]);

            console.log('Todos os medicamentos:', allMedications); // Log para depuração
            console.log('Doses de hoje:', todaysDoses); // Log para depuração

            setDoseHistory(todaysDoses);
            setMedications(allMedications);

            const today = new Date();

            const filteredMedications = allMedications.filter((med) => {
                if (!med.duration) return false;

                const durationValue = typeof med.duration === 'string'
                    ? parseInt(med.duration, 10)
                    : Math.floor(med.duration);

                if (durationValue === -1) return true;

                const startDate = new Date(med.startDate);
                if (isNaN(startDate.getTime())) return false;

                const endDate = new Date(startDate.getTime() + durationValue * 24 * 60 * 60 * 1000);
                return today >= startDate && today <= endDate;
            });

            console.log('Medicamentos filtrados para hoje:', filteredMedications); // Log para depuração

            setTodaysMedications(filteredMedications);
            const completed = todaysDoses.filter((dose) => dose.taken).length;
            setCompletedDoses(completed);
        } catch (error) {
            console.error("Erro ao carregar medicações: ", error);
            Alert.alert("Erro", "Não foi possível carregar os medicamentos");
        }
    }, []);

    const setupNotifications = async () => {
        try {
            const token = await registerNotificationsAsync();
            if (!token) {
                console.log("Falha ao obter o token de notificações");
                return;
            }

            const medications = await getMedication();
            for (const medication of medications) {
                if (medication.reminderEnabled) {
                    await sheduleMedicationReminder(medication);
                }
            }
        } catch (error) {
            console.error("Erro ao configurar notificações: ", error);
        }
    }

    useEffect(() => {
        loadMedications();
        setupNotifications();

        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                loadMedications();
            }
        });
        return () => {
            subscription.remove();
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadMedications();
            return () => {};
        }, [loadMedications])
    );

    const handleTakeDose = async (medication) => {
        try {
            await recordDose(medication.id, true, new Date().toISOString());
            await loadMedications();
            Alert.alert("Sucesso", `Dose de ${medication.name} registrada com sucesso!`);
        } catch (error) {
            console.error("Erro ao registrar dose: ", error);
            Alert.alert("Erro", "Falha ao registrar a dose. Tente novamente.");
        }
    };

    const isDoseTaken = (medicationId) => {
        return doseHistory.some(
            (dose) => dose.medicationId === medicationId && dose.taken
        );
    }; 

    const progress = todaysMedications.length > 0 ? completedDoses / todaysMedications.length : 0;

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerTop}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.greeting}>Progresso Diário</Text>
                        </View>
                        <TouchableOpacity style={styles.notificationButton}>
                            <Ionicons name='notifications-outline' size={24} color={COLORS.white} />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationCount}></Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <CircularProgress
                        progress={progress}
                        totalDoses={todaysMedications.length}
                        completedDoses={completedDoses}
                    />
                </View>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.quickActionsContainer}>
                    <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                    <View style={styles.quickActionsGrid}>
                        {QUICK_ACTIONS.map((action) => (
                            <Link href={action.route} key={action.label} asChild>
                                <TouchableOpacity style={styles.actionButton}>
                                    <LinearGradient
                                        colors={action.gradient}
                                        style={styles.actionGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <View style={styles.actionContent}>
                                            <View style={styles.actionIcon}>
                                                <Ionicons name={action.icon} size={24} color={COLORS.white} />
                                            </View>
                                            <Text style={styles.actionLabel}>{action.label}</Text>
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
                    <Link href='/calendar' asChild>
                        <TouchableOpacity>
                            <Text style={styles.seeAllButton}>Ver tudo</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {todaysMedications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Fontisto name="pills" size={24} color={COLORS.textLight} />
                        <Text style={styles.emptyStateText}>Nenhum medicamento agendado</Text>
                        <Link href='/medicacoes/add' asChild>
                            <TouchableOpacity style={styles.addMedicationButton}>
                                <LinearGradient
                                    colors={[COLORS.primary, COLORS.secondary]}
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
                    todaysMedications.map((medication) => {
                        const taken = isDoseTaken(medication.id);
                        return (
                            <View style={styles.doseCard} key={medication.id}>
                                <View style={[
                                    styles.doseBadge, {
                                        backgroundColor: `${medication.color || COLORS.primary}15`
                                    }
                                ]}>
                                    <Ionicons name='medical' size={24} color={COLORS.white} />
                                </View>
                                <View style={styles.doseInfo}>
                                    <View>
                                        <Text style={styles.medicineName}>{medication.name || 'Medicamento sem nome'}</Text>
                                        <Text style={styles.dosageInfo}>{medication.dose || 'Dose não especificada'}</Text>
                                    </View>
                                    <View style={styles.doseTime}>
                                        <Ionicons name='time-outline' size={16} color={COLORS.textLight} />
                                        <Text style={styles.timeText}>
                                            {medication.times && medication.times.length > 0 
                                                ? medication.times[0] 
                                                : 'Horário não definido'}
                                        </Text>
                                    </View>
                                </View>
                                {taken ? (
                                    <View style={[styles.takeDoseButton, { backgroundColor: COLORS.success }]}>
                                        <Ionicons name='checkmark-circle-outline' size={16} color={COLORS.white} />
                                        <Text style={styles.takeDoseText}>Tomado</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity 
                                        style={[styles.takeDoseButton, { backgroundColor: medication.color || COLORS.primary }]} 
                                        onPress={() => handleTakeDose(medication)}
                                    >
                                        <Text style={styles.takeDoseText}>Tomar</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}
            </View>

            <Modal visible={false} transparent={true} animationType='slide'>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Notificações</Text>
                        <TouchableOpacity style={styles.closeButton}>
                            <Ionicons name='close' size={24} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

// Estilos permanecem exatamente os mesmos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 50,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
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
        color: COLORS.white,
        opacity: 0.9,
    },
    content: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: COLORS.background,
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
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        minWidth: 20,
    },
    notificationCount: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.white
    },
    progressDetails: {
        fontSize: 11,
        color: COLORS.white,
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
        color: COLORS.white,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    actionGradient: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
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
        color: COLORS.white,
        fontWeight: '600',
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
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
        color: COLORS.primary,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    emptyStateText: {
        fontSize: 16,
        color: COLORS.textLight,
        marginTop: 10,
        marginBottom: 20,
    },
    addMedicationButton: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    addMedicationGradient: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addMedicationButtonText: {
        color: COLORS.white,
        fontWeight: '600'
    },
    doseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
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
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: COLORS.primary,
    },
    doseInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    medicineName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    dosageInfo: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    doseTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        marginLeft: 5,
        color: COLORS.textLight,
        fontSize: 14,
    },
    takeDoseButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    takeDoseText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: COLORS.card,
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
        color: COLORS.text
    },
    closeButton: {
        padding: 5,
    },
    notificationContent: {
        flex: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        marginBottom: 10,
        alignItems: 'center',
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    notificationTime: {
        fontSize: 12,
        color: COLORS.textLight,
    }
});