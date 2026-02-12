import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSessionTimer } from "../src/hooks/useSessionTimer";
import {
  saveSessionStart,
  getSessionStart,
  clearSessionStart,
} from "../src/services/storage";
import { logLogout } from "../src/services/logger";

export default function SessionScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      const existing = await getSessionStart();

      if (existing) {
        setStartTimestamp(existing);
      } else {
        const now = Date.now();
        await saveSessionStart(now);
        setStartTimestamp(now);
      }
    };

    initializeSession();
  }, []);

  const { formattedTime, stopTimer } =
    useSessionTimer(startTimestamp);

  const handleLogout = useCallback(async () => {
    try {
      stopTimer();

      await clearSessionStart();

      if (email) {
        logLogout(email);
      }

      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  }, [email, stopTimer]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Active</Text>

      {startTimestamp && (
        <>
          <Text style={styles.startTime}>
            Started At: {new Date(startTimestamp).toLocaleTimeString()}
          </Text>

          <Text style={styles.duration}>
            Duration: {formattedTime}
          </Text>
        </>
      )}

      <Button title="Logout" onPress={handleLogout} />
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
    textAlign: "center",
    marginBottom: 20,
  },
  startTime: {
    textAlign: "center",
    marginBottom: 10,
  },
  duration: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
});
