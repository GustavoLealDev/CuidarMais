import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Quar", "Quin", "Sex", "Sáb"];

export default function CalendarioScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const router = useRouter();

    return (
        <View>
            <LinearGradient
                colors={["#4361EE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <View>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={"white"} />
                    </TouchableOpacity>
                    <Text>Calendário</Text>
                </View>
            </LinearGradient>

            <View>
                <View>
                    <TouchableOpacity>
                        <Ionicons name="arrow-back" size={24} color={"#4361EE"} />
                    </TouchableOpacity>
                    <Text>
                        {selectedDate.toLocaleDateString("pt-BR", {
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>
                    <TouchableOpacity>
                        <Ionicons name="arrow-forward" size={24} color={"#4361EE"} />
                    </TouchableOpacity>
                </View>
                <View>
                    {WEEKDAYS.map((day) => (
                        <Text key={day}>{day}</Text>
                    ))}
                </View>
                <View>
                    <Text>
                        {selectedDate.toLocaleDateString("pt-BR", {
                            month: "long",
                            year: "numeric",
                            day: "numeric",
                        })}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});