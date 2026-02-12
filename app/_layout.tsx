import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="login"
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="otp"
        options={{ title: "Enter OTP" }}
      />
      <Stack.Screen
        name="session"
        options={{ title: "Session", headerLeft: () => null }}
      />
    </Stack>
  );
}
