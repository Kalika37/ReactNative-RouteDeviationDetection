import React from "react";
import { useAuth } from "../authenticate/AuthProvider";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AdminGuard({ children }) {
  const { adminAccess, loading } = useAuth();
  const navigation = useNavigation();
  console.log("ADmin")
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!adminAccess) {
    // redirect normal users
    navigation.replace("App"); // or "Home"
    return null;
  }

  return children;
}