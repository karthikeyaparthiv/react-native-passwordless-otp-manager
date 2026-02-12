import { useEffect, useRef, useState, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * Custom hook to track session duration
 *
 * @param startTimestamp - session start time (in milliseconds)
 */
export const useSessionTimer = (startTimestamp: number | null) => {
  const [duration, setDuration] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const updateDuration = useCallback(() => {
    if (!startTimestamp) return;

    const now = Date.now();
    const diffInSeconds = Math.floor((now - startTimestamp) / 1000);

    setDuration(diffInSeconds);
  }, [startTimestamp]);

  const startTimer = useCallback(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => {
      updateDuration();
    }, 1000);
  }, [updateDuration]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!startTimestamp) return;

    updateDuration();
    startTimer();

    return () => {
      stopTimer();
    };
  }, [startTimestamp, updateDuration, startTimer, stopTimer]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appStateRef.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          updateDuration();
        }

        appStateRef.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [updateDuration]);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return {
    duration,
    formattedTime,
    stopTimer,
  };
};
