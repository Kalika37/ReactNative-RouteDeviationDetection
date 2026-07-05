import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import axios from "axios";

import {
  getDeviceId,
  getFcmToken,
  getLocation,
  getPlatform,
} from "./deviceUtils";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin({
  BackendHost,
  navigation,
}) {
  const [request, response, promptAsync] =
    Google.useAuthRequest({
      expoClientId:
        "YOUR_EXPO_CLIENT_ID",
      androidClientId:
        "YOUR_ANDROID_CLIENT_ID",
      iosClientId:
        "YOUR_IOS_CLIENT_ID",
      webClientId:
        "YOUR_WEB_CLIENT_ID",
    });

  React.useEffect(() => {
    if (response?.type === "success") {
      handleFirebaseLogin(
        response.authentication.accessToken
      );
    }
  }, [response]);

  const handleFirebaseLogin = async (
    accessToken
  ) => {
    try {
      const deviceId =
        await getDeviceId();
      const platform = getPlatform();
      const fcmToken =
        await getFcmToken();
      const location =
        await getLocation();

      const res = await axios.post(
        `${BackendHost}/google-login`,
        {
          accessToken,
          deviceId,
          platform,
          fcmToken,
          location,
        }
      );

      if (res.data.success) {
        navigation.replace(
          "Dashboard"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => promptAsync()}
    >
      <Image
        source={{
          uri:
            "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
        }}
        style={styles.icon}
      />
      <Text style={styles.text}>
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
  },

  text: {
    color: "#111827",
    fontWeight: "600",
  },

  icon: {
    width: 22,
    height: 22,
  },
});