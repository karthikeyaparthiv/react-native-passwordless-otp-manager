import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { validateOtp, generateOtp } from "../src/services/otpManager";
import { OTP_EXPIRY_SECONDS } from "../src/constants/config";

export default function OtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otpInput, setOtpInput] = useState("");
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const handleValidateOtp = useCallback(async () => {
    if (!email) return;

    if (otpInput.length !== 6) {
      Alert.alert("Error", "Enter 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const result = await validateOtp(email, otpInput);

      switch (result.status) {
        case "SUCCESS":
          router.replace({
            pathname: "/session",
            params: { email },
          });
          break;

        case "INVALID_OTP":
          Alert.alert(
            "Invalid OTP",
            `Attempts left: ${result.attemptsLeft}`
          );
          break;

        case "EXPIRED":
          Alert.alert("Expired", "OTP has expired");
          break;

        case "ATTEMPTS_EXCEEDED":
          Alert.alert("Blocked", "Maximum attempts exceeded");
          break;

        case "NOT_FOUND":
          Alert.alert("Error", "No OTP found. Please resend.");
          break;
      }
    } catch (error) {
      Alert.alert("Error", "Validation failed");
    } finally {
      setLoading(false);
    }
  }, [email, otpInput]);

  const handleResendOtp = useCallback(async () => {
    if (!email) return;

    try {
      await generateOtp(email);
      setCountdown(OTP_EXPIRY_SECONDS);
      setOtpInput("");

      Alert.alert("Success", "New OTP generated");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP");
    }
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <Text style={styles.emailText}>{email}</Text>

      <TextInput
        placeholder="Enter 6-digit OTP"
        value={otpInput}
        onChangeText={setOtpInput}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />

      <Text style={styles.timer}>
        Expires in: {countdown}s
      </Text>

      <Button
        title={loading ? "Validating..." : "Verify OTP"}
        onPress={handleValidateOtp}
        disabled={loading}
      />

      <View style={{ marginTop: 16 }}>
        <Button
          title="Resend OTP"
          onPress={handleResendOtp}
          disabled={countdown > 0}
        />
      </View>
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
    marginBottom: 10,
    textAlign: "center",
  },
  emailText: {
    textAlign: "center",
    marginBottom: 20,
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 4,
  },
  timer: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
});
