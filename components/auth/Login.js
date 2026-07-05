import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import axios from 'axios';
axios.defaults.withCredentials = true;

import { firebase_login, firebase_logout } from './firebaseAuth';

import GoogleLogin from './GoogleLogin';
import {
  getDeviceId,
  getFcmToken,
  getLocation,
  getPlatform,
} from './deviceUtils';
import { useAuth } from '../../authenticate/AuthProvider';

export default function LoginScreen({ BackendHost, navigation }) {
  const { authenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const updateDeviceInfo = async () => {
    const deviceId = await getDeviceId();
    const fcmToken = await getFcmToken();
    const location = await getLocation();

    const res = await axios.post(`${BackendHost}/update`, {
      deviceId,
      platform: getPlatform(),
      fcmToken,
      location,
    });
    return res;
  };

  const handleSubmit = async () => {
    setLoginError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const request = await firebase_login(formData.email, formData.password);

      if (!request.success) {
        setLoginError(request.message);
        setLoading(false);
        return;
      }
      console.log({
        email: formData.email,
        password: formData.password,
        fcmToken: request.token,
      });
      const res = await axios.post(`${BackendHost}/login`, {
        email: formData.email,
        password: formData.password,
        fcmToken: request.token,
      });

      if (res.data.success) {
        const rres = await updateDeviceInfo();
        if (rres.data.success) {
          navigation.replace('App');
        }else{
          alert("finished") 
        }
      }
    } catch (error) {
      console.log(error);
      setLoginError(error?.response?.data?.message || 'Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🛡️</Text>

        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>Login to access SmartSOS</Text>

        {/* EMAIL */}
        <TextInput
          placeholder={'Email'}
          placeholderTextColor="#94a3b8"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          style={[styles.input, errors.email && styles.errorInput]}
        />

        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        {/* PASSWORD */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          style={[styles.input, errors.password && styles.errorInput]}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        {loginError ? (
          <Text style={styles.loginError}>{loginError}</Text>
        ) : null}

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* DIVIDER */}
        <Text style={styles.or}>
          OR {authenticated ? 'true' : 'false' || 'Email'}
        </Text>

        {/* GOOGLE LOGIN */}
        <GoogleLogin BackendHost={BackendHost} />

        {/* SIGNUP */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signup}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#050B18',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 28,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  logo: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },

  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    borderRadius: 14,
    color: '#fff',
    marginBottom: 5,
  },

  errorInput: {
    borderColor: '#ef4444',
  },

  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 10,
  },

  loginError: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#ff415c',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  or: {
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 15,
  },

  signup: {
    color: '#ff7087',
    textAlign: 'center',
    marginTop: 20,
  },
});
