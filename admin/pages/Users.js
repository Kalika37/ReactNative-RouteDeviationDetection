import React from "react";
import { View, Text } from "react-native";

export default function AdminUsers() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24 }}>
        Admin User Management
      </Text>
    </View>
  );
}