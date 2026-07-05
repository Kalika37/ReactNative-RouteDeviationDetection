import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";

import {
  firebase_register,
} from "./firebaseAuth";

import {
  getDeviceId,
  getFcmToken,
  getLocation,
  getPlatform,
} from "./deviceUtils";

axios.defaults.withCredentials = true;

export default function Signup({
  BackendHost,
  navigation,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Pick image (replacement of file input)
  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

    if (!result.canceled) {
      setFormData({
        ...formData,
        profilePicture:
          result.assets[0],
      });
    }
  };

  const validatePhone = (phone) => {
    const regex =
      /^(\+977)?(98|97|96)\d{8}$/;
    return regex.test(phone);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name)
      newErrors.name = "Name required";
    if (!formData.email)
      newErrors.email = "Email required";
    if (!formData.phone)
      newErrors.phone = "Phone required";

    if (
      formData.phone &&
      !validatePhone(formData.phone)
    ) {
      newErrors.phone =
        "Invalid phone number";
    }

    if (!formData.password)
      newErrors.password =
        "Password required";

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (!formData.profilePicture) {
      newErrors.profilePicture =
        "Profile image required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors)
      .length === 0;
  };

  const handleRegister = async () => {
    const deviceId = await getDeviceId();
    const fcmToken = await getFcmToken();
    const location = await getLocation();
    const platform = getPlatform();

    const request =
      await firebase_register(
        formData.email,
        formData.password
      );

    if (!request.success) {
      setLoginError(request.message);
      return;
    }

    if (!fcmToken || !location) {
      setLoginError(
        "Permissions required"
      );
      return;
    }

    const fd = new FormData();

    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    fd.append("password", formData.password);
    fd.append("bio", formData.bio || "");
    fd.append("idToken", request.token);

    // Image upload (React Native format)
    fd.append("profilePicture", {
      uri: formData.profilePicture.uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    fd.append(
      "devices",
      JSON.stringify([
        {
          deviceId,
          platform,
          fcmToken,
          lastActive: new Date(),
        },
      ])
    );

    fd.append(
      "location",
      JSON.stringify(location)
    );

    try {
      const res = await axios.post(
        `${BackendHost}/register`,
        fd,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        navigation.replace("Login");
      }
    } catch (error) {
      const data =
        error.response?.data;

      if (data?.field) {
        setErrors((prev) => ({
          ...prev,
          [data.field]:
            data.message,
        }));
      }

      setLoginError(
        data?.message ||
          "Signup failed"
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Join SmartSOS
        </Text>

        {/* IMAGE PICKER */}
        <TouchableOpacity
          onPress={pickImage}
          style={styles.avatar}
        >
          {formData.profilePicture ? (
            <Image
              source={{
                uri: formData
                  .profilePicture.uri,
              }}
              style={styles.image}
            />
          ) : (
            <Text style={styles.plus}>
              +
            </Text>
          )}
        </TouchableOpacity>

        {errors.profilePicture ? (
          <Text style={styles.error}>
            {
              errors.profilePicture
            }
          </Text>
        ) : null}

        {/* INPUTS */}
        {[
          ["name", "Full Name"],
          ["email", "Email"],
          ["phone", "Phone"],
        ].map(([key, placeholder]) => (
          <TextInput
            key={key}
            placeholder={
              placeholder
            }
            placeholderTextColor="#94a3b8"
            style={styles.input}
            onChangeText={(t) =>
              handleChange(
                key,
                t
              )
            }
          />
        ))}

        {/* PASSWORD */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#94a3b8"
          style={styles.input}
          onChangeText={(t) =>
            handleChange(
              "password",
              t
            )
          }
        />

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          placeholderTextColor="#94a3b8"
          style={styles.input}
          onChangeText={(t) =>
            handleChange(
              "confirmPassword",
              t
            )
          }
        />

        {/* BIO */}
        <TextInput
          placeholder="Bio"
          multiline
          placeholderTextColor="#94a3b8"
          style={[
            styles.input,
            {
              height: 80,
            },
          ]}
          onChangeText={(t) =>
            handleChange(
              "bio",
              t
            )
          }
        />

        {loginError ? (
          <Text style={styles.error}>
            {loginError}
          </Text>
        ) : null}

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >
          <Text
            style={
              styles.buttonText
            }
          >
            Create Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "Login"
            )
          }
        >
          <Text style={styles.link}>
            Already have an account?
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#050b18",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor:
      "rgba(255,255,255,0.06)",
    padding: 25,
    borderRadius: 25,
  },

  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor:
      "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },

  plus: {
    fontSize: 30,
    color: "#ff4d6d",
  },

  input: {
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#ff4d6d",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  link: {
    color: "#ff6b81",
    textAlign: "center",
    marginTop: 15,
  },

  error: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 8,
  },
});