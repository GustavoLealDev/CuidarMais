import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getDoseHistory, getMedication, recordDose } from "../../utils/storage";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function CalendarioScreen() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [medications, setMedications] = useState([]);
    const [doseHistory, setDoseHistory] = useState([]);

    const loadData = useCallback(async () => {
        try {
            const [meds, history] = await Promise.all([
                getMedication(),
                getDoseHistory(),
            ]);
            setMedications(meds);
            setDoseHistory(history);
        } catch (error) {
            console.error("Error loading calendar data:", error);
        }
    }, [selectedDate]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(selectedDate);

    const renderCalendar = () => {
        const calendar = [];
        let week = [];


        for (let i = 0; i < firstDay; i++) {
            week.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
        }

        // Add days of the month
        for (let day = 1; day <= days; day++) {
            const date = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                day
            );
            const isToday = new Date().toDateString() === date.toDateString();
            const hasDoses = doseHistory.some(
                (dose) =>
                    new Date(dose.timestamp).toDateString() === date.toDateString()
            );

            week.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.calendarDay,
                        isToday && styles.today,
                        hasDoses && styles.hasEvents,
                    ]}
                    onPress={() => setSelectedDate(date)}
                >
                    <Text style={[styles.dayText, isToday && styles.todayText]}>
                        {day}
                    </Text>
                    {hasDoses && <View style={styles.eventDot} />}
                </TouchableOpacity>
            );

            if ((firstDay + day) % 7 === 0 || day === days) {
                calendar.push(
                    <View key={day} style={styles.calendarWeek}>
                        {week}
                    </View>
                );
                week = [];
            }
        }

        return calendar;
    };

    const renderMedicationsForDate = () => {
        const dateStr = selectedDate.toDateString();
        const dayDoses = doseHistory.filter(
            (dose) => new Date(dose.timestamp).toDateString() === dateStr
        );

        return medications.map((medication) => {
            const taken = dayDoses.some(
                (dose) => dose.medicationId === medication.id && dose.taken
            );

            return (
                <View key={medication.id} style={styles.medicationCard}>
                    <View
                        style={[
                            styles.medicationColor,
                            { backgroundColor: medication.color },
                        ]}
                    />
                    <View style={styles.medicationInfo}>
                        <Text style={styles.medicationName}>{medication.name}</Text>
                        <Text style={styles.medicationDosage}>{medication.dosage}</Text>
                        <Text style={styles.medicationTime}>{medication.times[0]}</Text>
                    </View>
                    {taken ? (
                        <View style={styles.takenBadge}>
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                            <Text style={styles.takenText}>Taken</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.takeDoseButton,
                                { backgroundColor: medication.color },
                            ]}
                            onPress={async () => {
                                await recordDose(medication.id, true, new Date().toISOString());
                                loadData();
                            }}
                        >
                            <Text style={styles.takeDoseText}>Take</Text>
                        </TouchableOpacity>
                    )}
                </View>
            );
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#4361EE", "#3A56D9"]}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Calendário</Text>
                </View>

                <View style={styles.calendarContainer}>
                    <View style={styles.monthHeader}>
                        <TouchableOpacity
                            onPress={() =>
                                setSelectedDate(
                                    new Date(
                                        selectedDate.getFullYear(),
                                        selectedDate.getMonth() - 1,
                                        1
                                    )
                                )
                            }
                        >
                            <Ionicons name="chevron-back" size={24} color="#4361EE" />
                        </TouchableOpacity>
                        <Text style={styles.monthText}>
                            {`${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                setSelectedDate(
                                    new Date(
                                        selectedDate.getFullYear(),
                                        selectedDate.getMonth() + 1,
                                        1
                                    )
                                )
                            }
                        >
                            <Ionicons name="chevron-forward" size={24} color="#4361EE" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekdayHeader}>
                        {WEEKDAYS.map((day) => (
                            <Text key={day} style={styles.weekdayText}>
                                {day}
                            </Text>
                        ))}
                    </View>

                    {renderCalendar()}
                </View>

                <View style={styles.scheduleContainer}>
                    <Text style={styles.scheduleTitle}>
                        {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}
                    </Text>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}
                    >
                        {renderMedicationsForDate()}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    headerGradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: Platform.OS === "ios" ? 160 : 140,
    },
    content: {
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 60 : 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingBottom: 24,
        zIndex: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "white",
        marginLeft: 16,
    },
    calendarContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        margin: 20,
        padding: 20,
        shadowColor: "#4361EE",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    monthHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    monthText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#4361EE",
    },
    weekdayHeader: {
        flexDirection: "row",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
        paddingBottom: 8,
    },
    weekdayText: {
        flex: 1,
        textAlign: "center",
        color: "#64748B",
        fontWeight: "600",
        fontSize: 14,
    },
    calendarWeek: {
        flexDirection: "row",
        marginBottom: 8,
    },
    calendarDay: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        margin: 2,
    },
    dayText: {
        fontSize: 16,
        color: "#334155",
        fontWeight: "500",
    },
    today: {
        backgroundColor: "#4361EE",
    },
    todayText: {
        color: "white",
        fontWeight: "600",
    },
    hasEvents: {
        position: "relative",
    },
    eventDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#4361EE",
        position: "absolute",
        bottom: 8,
    },
    scheduleContainer: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
    },
    scrollContainer: {
        paddingBottom: 24,
    },
    scheduleTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#4361EE",
        marginBottom: 20,
    },
    medicationCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    medicationColor: {
        width: 16,
        height: 48,
        borderRadius: 8,
        marginRight: 16,
    },
    medicationInfo: {
        flex: 1,
    },
    medicationName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 4,
    },
    medicationDosage: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 4,
    },
    medicationTime: {
        fontSize: 14,
        fontWeight: "500",
        color: "#4361EE",
    },
    takeDoseButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: "#4361EE",
    },
    takeDoseText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    takenBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    takenText: {
        color: "#10B981",
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 4,
    },
});