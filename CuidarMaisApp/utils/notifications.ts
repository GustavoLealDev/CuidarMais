import Constants from 'expo-constants';
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Medication } from "./storage";


// Configura o manipulador de notificações padrão para definir como as notificações
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
});

//Registra o dispositivo para receber notificações push e configura os canais necessários.
export async function registerNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    // Verifica se estamos rodando em um dispositivo físico
    if (!Constants.expoConfig?.extra?.eas?.projectId) {
        console.warn('Project ID not found, notifications might not work properly');
        return null;
    }

    // Verifica o status da permissão
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Solicita permissão se necessário
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return null;
    }

    try {
        // Obtém o token push com o projectId
        const response = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
        });
        token = response.data;

        // Configuração para Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#4361EE',
            });
        }

        return token;
    } catch (error) {
        console.error('Error ao obter token:', error);
        return null;
    }
}

//Agenda notificações para um medicamento com base nos horários configurados
export async function scheduleMedication(medication: Medication): Promise<string | undefined> {
    // Se os lembretes estiverem desativados, não agenda
    if (!medication.reminderEnable) return;

    try {
         // Agenda uma notificação para cada horário definido no medicamento
        for (const time of medication.times) {
            const [hours, minutes] = time.split(':').map(Number);
            const today = new Date();
            today.setHours(hours, minutes, 0, 0);

            if (today < new Date()) {
                today.setDate(today.getDate() + 1)
            }

            // Agenda a notificação com repetição diária
            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "lembrete de medicamentos",
                    body: `Hora de tomar ${medication.name} (${medication.dosage})`,
                    data: { medicationId: medication.id },
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

//Cancela todas as notificações agendadas para um medicamento específico
export async function cancelMedication(medicationId: string): Promise<void> {
    try {
        const scheduledNotifications = 
            await Notifications.getAllScheduledNotificationsAsync();
        
        // Filtra e cancela apenas as notificações do medicamento especificado
        for (const notification of scheduledNotifications) {
            const data = notification.content.data as {
                medicationId?: string;
            } | null;
            
            if (data?.medicationId === medicationId) {
                await Notifications.cancelScheduledNotificationAsync(
                    notification.identifier
                );
            }
        }
    } catch (error) {
        console.error("Erro ao cancelar lembretes de medicamentos:", error);
        throw error;
    }
}

//Atualiza as notificações para um medicamento (cancela as existentes e agenda novas)
export async function updateMedication(medication: Medication): Promise<void> {
    try {
        await cancelMedication(medication.id);

        await scheduleMedication(medication);
    } catch (error) {
        console.error("Erro ao atualizar lembretes de medicamentos:", error);
        throw error;
    }
}
