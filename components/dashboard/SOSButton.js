import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";

export default function SOSButton({ onPress }) {
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.6)).current;
  const opacity2 = useRef(new Animated.Value(0.4)).current;
  const opacity3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const createPulse = (scale, opacity, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 2.2,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    createPulse(scale1, opacity1, 0);
    createPulse(scale2, opacity2, 600);
    createPulse(scale3, opacity3, 1200);
  }, []);

  return (
    <View style={styles.container}>
      {/* Ring 1 */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: scale1 }],
            opacity: opacity1,
          },
        ]}
      />

      {/* Ring 2 */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: scale2 }],
            opacity: opacity2,
          },
        ]}
      />

      {/* Ring 3 */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: scale3 }],
            opacity: opacity3,
          },
        ]}
      />

      {/* Center SOS Button */}
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>SOS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
  },

  ring: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "rgba(255,0,0,0.3)",
  },

  button: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  text: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
  },
});