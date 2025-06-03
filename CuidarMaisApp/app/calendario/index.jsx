import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

