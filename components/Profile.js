import React from "react";
import { View, Text } from "react-native";

export default function Profile() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 26 }}>
        👤 User Profile
      </Text>

      <Text>Name: Demo User</Text>
      <Text>Email: demo@test.com</Text>
      <Text>Phone: 9800000000</Text>
    </View>
  );
}