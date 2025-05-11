import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

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

    const FrequencyOptions = () => {
        return (
            <View>
                {FREQUENCIA.map((freq) => (
                    <TouchableOpacity key={freq.id}>
                        <View>
                            <Ionicons name={freq.icon} size={24} />
                            <Text>{freq.label}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }

    const DurationOptions = () => {
        return (
            <View>
                {DURACAO.map((dur) => (
                    <TouchableOpacity key={dur.id}>
                        <View>
                            <Text>{dur.value > 0 ? dur.value : '∞'}</Text>
                            <Text>{dur.label}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }


    return (
        <View>
            <LinearGradient
                colors={['#1a8e2d', '#146922']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View>
                <View>
                    <TouchableOpacity>
                        <Ionicons name="arrow-back-circle-sharp" size={24} color="black" />
                    </TouchableOpacity>
                    <Text>Nova Medicação</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <View>
                            <TextInput placeholder='Nome da medicação' placeholderTextColor={'#999'} />
                        </View>
                        <View>
                            <TextInput placeholder='Dosagem (Ex. 500mg)' placeholderTextColor={'#999'} />
                        </View>
                        <Text>Frequencia?</Text>
                        {FrequencyOptions()}
                        <Text>Por quanto tempo?</Text>
                        {DurationOptions()}

                        <TouchableOpacity>
                            <View>
                                <Ionicons name="calender" size={20} color={'black'} />
                            </View>
                            <Text>Inicio: { }</Text>
                        </TouchableOpacity>
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
                                <Switch trackColor={{false : '#ddd', true: 'black'}}
                                thumbColor={'white'}/>
                            </View>
                        </View>
                    </View>
                        <View>
                            <View>
                                <TextInput placeholder="Instrução especial"
                                placeholderTextColor='#999'/>
                            </View>
                        </View>
                </ScrollView>
                <View>
                    <TouchableOpacity>
                        <LinearGradient colors={['black', 'white']}
                        start={{x : 0 , y: 0}}
                        end={{x : 1 , y : 0}}
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