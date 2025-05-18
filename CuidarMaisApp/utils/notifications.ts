import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Medication } from "./storage";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
});

export async function registerNotificationsAsync(): Promise<string|null> {
    let token : string | null = null;

    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if(existingStatus !== 'granted'){
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status
    }

    if(finalStatus !== 'granted'){
        return null;
    }

    try{
        const response = await Notifications.getExpoPushTokenAsync();
        token = response.data;

        if(Platform.OS === 'android'){
            await Notifications.setNotificationChannelAsync('default',{
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0,250,250,250],
                lightColor: '4361EE',
            });
        }

        return token;
    } catch(error){
        console.error('Error ao obter token:', error);
        return null;
    }
}

export async function scheduleMedication(medication: Medication): Promise<string| undefined> {
    if(!medication.reminderEnable) return;

    try{
        for(const time of medication.times){
            const [hours, minutes] = time.split(':').map(Number);
            const today = new Date();
            today.setHours(hours,minutes,0,0);

            if(today < new Date()){
                today.setDate(today.getDate() + 1)
            }

            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "lembrete de medicamentos",
                     body: `Hora de tomar ${medication.name} (${medication.dosage})`,
                    data: {medicationId: medication.id},
                },
                trigger: {
                    hour: hours,
                    minute: minutes,
                    repeats: true,
                },
            });

            return identifier;
        }
    } catch (error) {
        console.error("Erro ao agendar lembrete de medicação", error);
        return undefined;
    }
}