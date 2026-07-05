import React from "react";
import { useAuth } from "../authenticate/AuthProvider";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from './LoadingScreen';

export default function AuthGuard({ children }) {
  const { authenticated, loading } = useAuth();
  const navigation = useNavigation();
  if (loading) {
    return <LoadingScreen/>
  }
  if (authenticated) {
    // redirect normal users
    navigation.replace("App"); // or "Home"
    return null;
  }
 
  return children;
}