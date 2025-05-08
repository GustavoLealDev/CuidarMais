import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
    return (
      <LinearGradient colors={["4CAF50", "#2E7D32"]}>
        <View>
            <View>
                <Ionicons name='medical' size={80} color="white"/>
            </View>
        </View>
        
      </LinearGradient>
    );
}