import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { generateOtp } from "../src/services/otpManager";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = useCallback((value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, []);

  const handleSendOtp = useCallback(async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("Error", "Email is required");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert("Error", "Enter a valid email");
      return;
    }

    try {
      setLoading(true);

      await generateOtp(trimmedEmail);

      router.push({
        pathname: "/otp",
        params: { email: trimmedEmail },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to generate OTP");
    } finally {
      setLoading(false);
    }
  }, [email, isValidEmail]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passwordless Login</Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Button
        title={loading ? "Sending..." : "Send OTP"}
        onPress={handleSendOtp}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
});
