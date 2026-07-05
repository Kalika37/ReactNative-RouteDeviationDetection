import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LoaderCircle, WifiOff } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function LoadingScreen({
  error = "",
  message = "Verifying Authentication...",
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!error) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [error]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.card}>
        {!error ? (
          <>
            <Animated.View
              style={{
                transform: [{ rotate: spin }],
              }}
            >
              <LoaderCircle
                size={60}
                color="#2563eb"
                strokeWidth={2.5}
              />
            </Animated.View>

            <Text style={styles.title}>
              Please Wait
            </Text>

            <Text style={styles.subtitle}>
              {message}
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar} />
            </View>
          </>
        ) : (
          <>
            <WifiOff
              size={60}
              color="#ef4444"
              strokeWidth={2.5}
            />

            <Text style={[styles.title, { color: "#ef4444" }]}>
              Connection Failed
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  glowOne: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#2563eb33",
    top: -40,
    left: -60,
  },

  glowTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#06b6d433",
    bottom: -30,
    right: -50,
  },

  card: {
    width: width * 0.86,
    backgroundColor: "#111827",
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 22,
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },

  progressContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#1e293b",
    borderRadius: 100,
    overflow: "hidden",
    marginTop: 28,
  },

  progressBar: {
    width: "65%",
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 100,
  },

  errorText: {
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
  },
});