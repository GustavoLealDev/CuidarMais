import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

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