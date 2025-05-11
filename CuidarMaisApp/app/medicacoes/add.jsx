import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Dimensions, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

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
        label: 'Duas vezez por dia',
        icon: 'sync-outline',
        times: ['09:00', '21:00'],
    },
    {
        id: '3',
        label: 'Três vezes por dia',
        icon: 'time-outline',
        times: ['09:00', '15:00', '21:00'],
    },
    {
        id: '4',
        label: 'Quatro vezes por dia',
        icon: 'repeat-outline',
        times: ['09:00', '13:00', '17:00', '21:00'],
    },
    {
        id: '5',
        label: 'Quando precisar',
        icon: 'calendar-outline',
        times: [],
    },

]

const DURACAO = [
    { id: '1', label: '7 dias', value: 7 },
    { id: '2', label: '14 dias', value: 14 },
    { id: '3', label: '30 dias', value: 30 },
    { id: '4', label: '90 dias', value: 90 },
    { id: '5', label: 'Andamento', value: -1 },
]
export default function AddMedicacaoScreen() {

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
    })

    const [errors, setErrors] = useState({});
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');



    const FrequencyOptions = () => {
        return (
            <View style={styles.optionsGrid}>
                {FREQUENCIA.map((freq) => (
                    <TouchableOpacity style={[styles.optionCard,
                    selectedFrequency === freq.label &&
                    styles.selectedOptionCard]}
                        key={freq.id}>
                        <View style={[
                            styles.optionIcon,
                            selectedFrequency === freq.label &&
                            styles.selectedOptionIcon,
                        ]}>
                            <Ionicons name={freq.icon}
                                size={24}
                                color={selectedFrequency == freq.label ? 'white' : '#666'} />
                            <Text style={[
                                styles.optionLabel,
                                selectedFrequency === freq.label && styles.selectedOptionLabel,
                            ]}>{freq.label}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }

    const DurationOptions = () => {
        return (
            <View style={styles.optionsGrid}>
                {DURACAO.map((dur) => (
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            selectedDuration === dur.label && styles.selectedOptionCard
                        ]}
                        key={dur.id}>
                            <Text style={[
                                styles.durationNumber,
                                selectedDuration === dur.label && styles.selectedDurationNumber
                            ]}>{dur.value > 0 ? dur.value : '∞'}</Text>
                            <Text style={[
                                styles.optionLabel,
                                selectedDuration === dur.label && styles.selectedOptionLabel
                            ]}>{dur.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <LinearGradient
                style={styles.headerGradient}
                colors={['#243560', 'black']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nova Medicação</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.section}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.mainInput, errors.name && styles.inputError]}
                                placeholder='Nome da medicação'
                                placeholderTextColor={'#999'}
                                value={form.name}
                                onChangeText={(text) => {
                                    setForm({ ...form, name: text })
                                    if (errors.name) {
                                        setErrors({ ...errors, name: '' })
                                    }
                                }}
                            />
                            {errors.name && (
                                <Text style={styles.errorText}>{errors.name}</Text>
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.mainInput, errors.name && styles.inputError]}
                                placeholder='Dosagem (Ex. 500mg)'
                                placeholderTextColor={'#999'}
                                value={form.dosage}
                                onChangeText={(text) => {
                                    setForm({ ...form, dosage: text })
                                    if (errors.name) {
                                        setErrors({ ...errors, dosage: '' })
                                    }
                                }}
                            />
                            {errors.dosage && (
                                <Text style={styles.errorText}>{errors.dosage}</Text>
                            )}
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.sectionTitle}>Frequencia?</Text>
                            {errors.frequency && (
                                <Text style={styles.errorText}>{errors.frequency}</Text>
                            )}
                            {FrequencyOptions()}
                            <Text style={styles.sectionTitle}>Por quanto tempo?</Text>
                            {errors.duration && (
                                <Text style={styles.errorText}>{errors.duration}</Text>
                            )}
                            {DurationOptions()}

                            <TouchableOpacity>
                                <View>
                                    <Ionicons name="calender" size={20} color={'black'} />
                                </View>
                                <Text>Inicio: { }</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker value={form.startDate} mode="date" />
                        <DateTimePicker mode="time"
                            value={(() => {
                                const [hours, minutes] = form.times[0].split(':').map(Number);
                                const date = new Date();
                                date.setHours(hours, minutes, 0, 0);
                                return date;
                            })()} />
                    </View>
                    <View>
                        <View>
                            <View>
                                <View>
                                    <View>
                                        <Ionicons name='notifications' color={'black'} />
                                    </View>
                                    <View>
                                        <Text>Lembretes</Text>
                                        <Text>Receba notificações quando for hora de tomar seus medicamentos</Text>
                                    </View>
                                </View>
                                <Switch trackColor={{ false: '#ddd', true: 'black' }}
                                    thumbColor={'white'} />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <TextInput placeholder="Instrução especial"
                                placeholderTextColor='#999' />
                        </View>
                    </View>
                </ScrollView>
                <View>
                    <TouchableOpacity>
                        <LinearGradient colors={['black', 'white']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text>
                                Adicionar medicação
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>
                            Voltar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
        marginLeft: 15,
    },
    contentContainer: {
        padding: 30,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#243560",
        marginBottom: 15,
        marginTop: 10,
    },
    mainInput: {
        fontSize: 20,
        color: '#333',
        padding: 15,
    },
    inputContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    inputError: {
        borderColor: '#FF5252',
    },
    errorText: {
        color: '#FF5252',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 12,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    optionCard: {
        width: (width - 60) / 2,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 15,
        margin: 5,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    selectedOptionCard: {
        backgroundColor: "#1a8e2d",
        borderColor: "#1a8e2d",
    },
    optionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    selectedOptionIcon: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },

    optionLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
    },
    selectedOptionLabel: {
        color: "white",
    },
    durationNumber: {
        fontSize: 24,
        fontWeight: "700",
        color: "#243560",
        marginBottom: 5,
    },
    selectedDurationNumber: {
        color: "white",
    }
});