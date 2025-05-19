import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

const FREQUENCIA = [
    {
        id: '1',
        label: 'Uma vez por dia',
        icon: 'sunny-outline',
        times: ['09:00'],
    },
    {
        id: '2',
        label: 'Duas vezes por dia',
        icon: 'alarm-outline',
        times: ['09:00', '21:00'],
    },
    {
        id: '3',
        label: 'Três vezes por dia',
        icon: 'ellipsis-horizontal-outline',
        times: ['09:00', '15:00', '21:00'],
    },
    {
        id: '4',
        label: 'Quatro vezes por dia',
        icon: 'pulse-outline',
        times: ['09:00', '13:00', '17:00', '21:00'],
    },
    {
        id: '5',
        label: 'Quando precisar',
        icon: 'time-outline',
        times: [],
    },
];

const DURACAO = [
    { id: '1', label: '7 dias', value: 7 },
    { id: '2', label: '14 dias', value: 14 },
    { id: '3', label: '30 dias', value: 30 },
    { id: '4', label: '90 dias', value: 90 },
    { id: '5', label: 'Contínuo', value: -1 },
];

const COLORS = {
    primary: '#4361EE',
    secondary: '#4361EE',
    accent: '#4895ef',
    light: '#f8f9fa',
    dark: '#212529',
    success: '#4cc9f0',
    danger: '#f72585',
    warning: '#f8961e',
    info: '#560bad',
    white: '#ffffff',
    gray: '#6c757d',
    lightGray: '#e9ecef',
};

export default function AddMedicacaoScreen() {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        startDate: new Date(),
        times: ['09:00'],
        reminderEnabled: true,
        refilReminder: false,
        currentSupply: '',
        refillAt: '',
        notes: '',
    });

    const FrequencyOptions = () => {
        return (
            <View style={styles.optionsGrid}>
                {FREQUENCIA.map((freq) => (
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            selectedFrequency === freq.label && styles.selectedOptionCard
                        ]}
                        key={freq.id}
                        onPress={() => {
                            setSelectedFrequency(freq.label);
                            setForm({ ...form, frequency: freq.label, times: freq.times });
                        }}
                    >
                        <View style={[
                            styles.optionIcon,
                            selectedFrequency === freq.label && styles.selectedOptionIcon,
                        ]}>
                            <Ionicons
                                name={freq.icon}
                                size={24}
                                color={selectedFrequency === freq.label ? COLORS.white : COLORS.primary}
                            />
                        </View>
                        <Text style={[
                            styles.optionLabel,
                            selectedFrequency === freq.label && styles.selectedOptionLabel,
                        ]}>
                            {freq.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const DurationOptions = () => {
        return (
            <View style={styles.optionsGrid}>
                {DURACAO.map((dur) => (
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            selectedDuration === dur.label && styles.selectedOptionCard
                        ]}
                        key={dur.id}
                        onPress={() => {
                            setSelectedDuration(dur.label);
                            setForm({ ...form, duration: dur.value });
                        }}
                    >
                        <Text style={[
                            styles.durationNumber,
                            selectedDuration === dur.label && styles.selectedDurationNumber
                        ]}>
                            {dur.value > 0 ? dur.value : '∞'}
                        </Text>
                        <Text style={[
                            styles.optionLabel,
                            selectedDuration === dur.label && styles.selectedOptionLabel
                        ]}>
                            {dur.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Digite o nome do medicamento";
        }
        if (!form.dosage.trim()) {
            newErrors.dosage = "Digite a Dosagem necessária";
        }
        if (!form.frequency.trim()) {
            newErrors.frequency = "Digite a Frequência";
        }
        if (!form.duration.trim()) {
            newErrors.duration = "Digite a duração";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handle = async () => {
        try {
            if (!validate()) {
                alert.alert("Error", "Por favor prencha todos os campos!!")
                return;
            }
            if (isSubmitting) return;
            setIsSubmitting(true);

            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63']
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            const medicationData = {
                id: Math.random().toString(36).substr(2, 9),
                ...form,
                currentSupply: form.currentSupply ? Number(form.currentSupply) : 0,
                totalSupply: form.currentSupply ? Number(form.currentSupply) : 0,
                refillAt: form.refillAt ? Number(form.refillAt) : 0,
                startDate: form.startDate.toISOString(),
                color: randomColor,
            };

            await addMedication(medicationData);
            if (medicationData.reminderEnabled) {
                await scheduleMedicationReminder(medicationData);
            }
            Alert.alert("Adicionado!", 'Medicação adicionada com sucesso!', [
                {
                    text: 'Ok',
                    onPress: () => router.back(),
                },
            ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Error ao salvar', error);
            Alert.alert('Error', 'Falha ao salvar medicação. Tente novamente!',
                [{ text: 'OK' }],
                { cancelable: false }

            );
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <View style={styles.container}>
            <LinearGradient
                style={styles.headerGradient}
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nova Medicação</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View style={styles.section}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.mainInput, errors.name && styles.inputError]}
                                placeholder='Nome da medicação'
                                placeholderTextColor={COLORS.gray}
                                value={form.name}
                                onChangeText={(text) => {
                                    setForm({ ...form, name: text });
                                    if (errors.name) {
                                        setErrors({ ...errors, name: '' });
                                    }
                                }}
                            />
                            {errors.name && (
                                <Text style={styles.errorText}>{errors.name}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.mainInput, errors.dosage && styles.inputError]}
                                placeholder='Dosagem (Ex. 500mg)'
                                placeholderTextColor={COLORS.gray}
                                value={form.dosage}
                                onChangeText={(text) => {
                                    setForm({ ...form, dosage: text });
                                    if (errors.dosage) {
                                        setErrors({ ...errors, dosage: '' });
                                    }
                                }}
                            />
                            {errors.dosage && (
                                <Text style={styles.errorText}>{errors.dosage}</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Frequência</Text>
                        {errors.frequency && (
                            <Text style={styles.errorText}>{errors.frequency}</Text>
                        )}
                        {FrequencyOptions()}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Duração do medicamento</Text>
                        {errors.duration && (
                            <Text style={styles.errorText}>{errors.duration}</Text>
                        )}
                        {DurationOptions()}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data de início</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <View style={styles.dateIconContainer}>
                                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                            </View>
                            <Text style={styles.dateButtonText}>
                                {form.startDate.toLocaleDateString('pt-BR')}
                            </Text>
                            <Ionicons name='chevron-forward' size={20} color={COLORS.gray} />
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={form.startDate}
                                mode="date"
                                display="spinner"
                                textColor={COLORS.dark}
                                themeVariant="light"
                                onChange={(event, date) => {
                                    setShowDatePicker(false);
                                    if (date) setForm({ ...form, startDate: date });
                                }}
                            />
                        )}
                    </View>

                    {form.frequency && form.frequency !== "Quando precisar" && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Horários da medicação</Text>
                            {form.times.map((time, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.timeButton}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <View style={styles.timeIconContainer}>
                                        <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.timeButtonText}>{time}</Text>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                                </TouchableOpacity>
                            ))}

                            {showTimePicker && (
                                <DateTimePicker
                                    mode="time"
                                    value={(() => {
                                        const [hours, minutes] = form.times[0].split(':').map(Number);
                                        const date = new Date();
                                        date.setHours(hours, minutes, 0, 0);
                                        return date;
                                    })()}
                                    display="spinner"
                                    textColor={COLORS.dark}
                                    themeVariant="light"
                                    onChange={(event, date) => {
                                        setShowTimePicker(false);
                                        if (date) {
                                            const newTime = date.toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            });
                                            setForm((prev) => ({
                                                ...prev,
                                                times: prev.times.map((t, i) => (i === 0 ? newTime : t))
                                            }));
                                        }
                                    }}
                                />
                            )}
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Configurações</Text>
                        <View style={styles.card}>
                            <View style={styles.switchRow}>
                                <View style={styles.switchLabelContainer}>
                                    <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
                                        <Ionicons name='notifications-outline' size={20} color={COLORS.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.switchLabel}>Ativar lembretes</Text>
                                        <Text style={styles.switchSubLabel}>
                                            Receber notificações nos horários programados
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={form.reminderEnabled}
                                    trackColor={{ false: COLORS.lightGray, true: COLORS.primary + '80' }}
                                    thumbColor={form.reminderEnabled ? COLORS.white : COLORS.white}
                                    ios_backgroundColor={COLORS.lightGray}
                                    onValueChange={(value) => setForm({ ...form, reminderEnabled: value })}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Observações</Text>
                        <View style={styles.textAreaContainer}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Instruções especiais, notas ou informações adicionais"
                                placeholderTextColor={COLORS.gray}
                                value={form.notes}
                                onChangeText={(text) => setForm({ ...form, notes: text })}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            isSubmitting && styles.saveButtonDisabled,
                        ]}
                        disabled={isSubmitting}
                        onPress={() => handle()}
                    >
                        <LinearGradient
                            style={styles.saveButtonGradient}
                            colors={[COLORS.primary, COLORS.accent]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.saveButtonText}>
                                {isSubmitting ? 'Adicionando...' : 'Adicionar medicação'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 140 : 120,
    },
    content: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        zIndex: 1
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.white,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.dark,
        marginBottom: 15,
    },
    mainInput: {
        fontSize: 16,
        color: COLORS.dark,
        padding: 15,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    inputContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    inputError: {
        borderColor: COLORS.danger,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 12,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    optionCard: {
        width: (width - 50) / 2,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    selectedOptionCard: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    optionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.light,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    selectedOptionIcon: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.dark,
        textAlign: "center",
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    selectedOptionLabel: {
        color: COLORS.white,
    },
    durationNumber: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 5,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    selectedDurationNumber: {
        color: COLORS.white,
    },
    dateButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    dateIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.light,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    dateButtonText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.dark,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    timeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    timeIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.light,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    timeButtonText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.dark,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    switchLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.dark,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        marginBottom: 2,
    },
    switchSubLabel: {
        fontSize: 13,
        color: COLORS.gray,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        lineHeight: 18,
    },
    textAreaContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    textArea: {
        height: 120,
        padding: 15,
        fontSize: 16,
        color: COLORS.dark,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        lineHeight: 22,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
    },
    saveButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 15,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    saveButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    cancelButtonText: {
        color: COLORS.gray,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
});