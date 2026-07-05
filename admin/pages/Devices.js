import React from "react";
import { View, Text } from "react-native";

export default function AdminDevices() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24 }}>
        Admin Device Management
      </Text>
    </View>
  );
}