import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="TabNav"/>
      <Stack.Screen name="Login"/>
    </Stack>
  )
}
