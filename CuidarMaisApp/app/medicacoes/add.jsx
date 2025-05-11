import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function AddMedicacaoScreen(){
    return(
        <View>
            <LinearGradient
            colors={['#1a8e2d', '#146922']}
            start={{x:0 , y:0}}
            end ={{x:1 , y: 1}}
            />
            <View>
                <View>
                    <TouchableOpacity>
                        <Ionicons name="arrow-back-circle-sharp" size={24} color="black" />
                    </TouchableOpacity>
                    <Text>Nova Medicação</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                </ScrollView>
            </View>
        </View>
    )
}