import React from "react";
import { View, Text } from "react-native";

export default function AdminDeviceDetails() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24 }}>
        Device Details Screen
      </Text>

      <Text>Serial: SOS001</Text>
      <Text>Status: Active</Text>
      <Text>Battery: 82%</Text>
    </View>
  );
}