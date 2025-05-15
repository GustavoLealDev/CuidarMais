import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento no AsyncStorage
const MEDICATION_KEY = '@medications';
const DOSE_HISTORY_KEY = '@dose_history';


/*
 Interface que define a estrutura de um medicamento
 Propriedades necessárias para um medicamento
 */
export interface Medication {
    id: string;
    name: string;
    dosage: string;
    times: string[];
    startDate: string;
    duration: string;
    color: string;
    reminderEnable: boolean;
    currentSupply: string;
    totalSupply: string;
    refillAt: string;
    refillReminder: boolean;
    lastRefillDate?: string;
}

/*
 Interface que define a estrutura do histórico de doses
 Registra quando e se uma dose foi tomada
 */
export interface DoseHistory {
    id: string;
    medicationId: string;
    timestamp: string;
    taken: boolean;
}

//Obtém a lista de todos os medicamentos armazenados volta com Array de medicamentos ou array vazio se ocorrer erro

export async function getMedication(): Promise<Medication[]> {
    try {
        const data = await AsyncStorage.getItem(MEDICATION_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error ao buscar medicação:', error);
        return [];
    }
}


//Adiciona um novo medicamento à lista existente
export async function addMedication(medication: Medication): Promise<void> {
    try {
        const medications = await getMedication();
        medications.push(medication);
        await AsyncStorage.setItem(MEDICATION_KEY, JSON.stringify(medications))
    } catch (error) {
        throw error;
    }
}


//Obtém todo o histórico de doses registrado
export async function getDoseHistory(): Promise<DoseHistory[]> {
    try {
        const data = await AsyncStorage.getItem(DOSE_HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error ao buscar dose:', error);
        return [];
    }
}


// Obtém apenas as doses registradas para o dia atual
export async function getTodaysDoses(): Promise<DoseHistory[]> {
    try {
        const history = await getDoseHistory();
        const today = new Date().toDateString();
        return history.filter(
            (dose) => new Date(dose.timestamp).toDateString() === today
        );
    } catch (error) {
        console.log("Error ao buscar dose diária:", error);
        return [];
    }
}

//Registra uma nova dose no histórico
export async function recordDose(
    medicationId: string,
    taken: boolean,
    timestamp: string
): Promise<void> {
    try {
        const history = await getDoseHistory();
        const newDose: DoseHistory = {
            id: Math.random().toString(36).substr(2, 9),
            medicationId,
            timestamp,
            taken,
        };
        history.push(newDose);
        await AsyncStorage.setItem(DOSE_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
        console.error('Error ao registrar dose:', error);
        throw error;
    }
}


//Limpa todos os dados armazenados (medicamentos e histórico de doses)
export async function clearAllData(): Promise<void> {
    try{
        await AsyncStorage.multiRemove([MEDICATION_KEY, DOSE_HISTORY_KEY]);
    } catch (error) {
        console.error('Error ao limpar data:', error);
        throw error;
    }
}

