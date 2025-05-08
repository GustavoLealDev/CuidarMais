import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
    return (
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <Ionicons name='medical' size={80} color="white"/>
            </View>
        </View>
      </LinearGradient>
    );
}