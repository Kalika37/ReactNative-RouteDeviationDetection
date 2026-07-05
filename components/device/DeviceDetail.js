import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';

import axios from 'axios';
axios.defaults.withCredentials = true;

import {
  Camera,
  Smartphone,
  User,
  MapPin,
  Battery,
  Shield,
  Phone,
} from 'lucide-react-native';
import CameraScreen from '../../camera/CameraCapture';

import UserSelect from './UserSelect';
export default function DeviceDetail({ route }) {
  const { serialNumber, BackendHost } = route.params;

  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [poinerEvents, setPointerEvents] = useState(true);
  const [device, setDevice] = useState();

  useEffect(() => {
    loadDevice();
  }, []);

  const loadDevice = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BackendHost}/device/${serialNumber}`
      );

      if (response.data.success) {
        setDevice(response.data.device);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }
  const onUserSelectionChanged = async (user) => {
    setPointerEvents(false);
    try {
      const response = await axios.put(
        `${BackendHost}/device/${serialNumber}`,
        {
          assignedUser: user.id,
        }
      );
      if (response.data.success) {
        setDevice(response.data.device);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPointerEvents(true);
    }
  };

  const updateImage = async (file) => {
    setPointerEvents(false);
    try {
      const fd = new FormData();
      let response;
      if (file.uri) {
        fd.append('profilePicture', {
          uri: file.uri,
          name: file.fileName || 'photo.jpg',
          type: file.type || 'image/jpeg',
        });
        response = await axios.put(
          `${BackendHost}/device/${serialNumber}`,
          fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        fd.append('profilePicture', file);
        response = await axios.put(
          `${BackendHost}/device/${serialNumber}`,
          fd
        );
      }

      if (response.data.success) {
        setDevice(response.data.device);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setPointerEvents(true);
    }
  };
  const onUpdateProfile = async () => {
    // handleChange()
    setShowCamera(true);
  };
  const PictureCaptured = async (file) => {
    updateImage(file);
    // try { 
    //   const name = 'profilePicture';
    //   setDevice((prev) => ({
    //     ...prev,
    //     [name]: file.uri ? file.uri : URL.createObjectURL(file),
    //   }));
    // } catch (err) {}
  };
  const handleChange = (e) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/jpg';
    input.name = 'profilePicture';
    input.onchange = (e) => {
      const { name, value, files } = input;
      if (files.length > 0) {
        updateImage(files[0]);
        setDevice((prev) => ({
          ...prev,
          [name]: URL.createObjectURL(files[0]),
        }));
        setShowCamera(false);
      }
    };
    input.click();
  };

  if (!device) {
    return (
      <View style={styles.loading}>
        <Text>Device not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      poinerEvents={poinerEvents ? 'auto' : 'none'}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image
            source={{
              uri: device.profilePicture || 'https://via.placeholder.com/150',
            }}
            style={styles.avatarImage}
          />

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={onUpdateProfile}>
            <Camera size={18} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{device.name}</Text>

        <Text style={styles.serial}>{device.serialNumber}</Text>
      </View>

      <View style={styles.card}>
        <UserSelect
          BackendHost={BackendHost}
          value={device?.assignedUser}
          onChange={(user) => {
            onUserSelectionChanged(user);
          }}
        />
        <Field
          icon={<Smartphone size={16} color="#4f46e5" />}
          label="Device Name"
          value={device.name}
        />

        <Field
          icon={<Shield size={16} color="#4f46e5" />}
          label="Device Type"
          value={device.deviceType}
        />

        <Field label="Firmware Version" value={device.firmwareVersion} />

        <Field
          icon={<User size={16} color="#4f46e5" />}
          label="Assigned User"
          value={device?.assignedUser?.name}
        />

        <Field
          label="Emergency Contact"
          value={device?.emergencyContact?.phone}
        />

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <MapPin size={16} color="#4f46e5" />

            <Text style={styles.label}>Last Location</Text>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.locationField}>
              <Text style={styles.smallLabel}>Latitude</Text>

              <TextInput
                editable={false}
                value={String(device?.lastLocation?.latitude || '')}
                style={styles.input}
              />
            </View>

            <View style={styles.locationField}>
              <Text style={styles.smallLabel}>Longitude</Text>

              <TextInput
                editable={false}
                value={String(device?.lastLocation?.longitude || '')}
                style={styles.input}
              />
            </View>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Battery size={20} color="#4f46e5" />

            <Text style={styles.statusText}>Battery</Text>
          </View>

          <Text style={styles.statusValue}>{device.batteryLevel}%</Text>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>SOS Active</Text>

          <Switch disabled value={device.sosEnabled} />
        </View>
      </View>
      <CameraScreen
        visible={showCamera}
        onCaptured={(photo) => {
          PictureCaptured(photo);
          setShowCamera(false);
        }}
      />
    </ScrollView>
  );
}

function Field({ icon, label, value }) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        {icon}

        <Text style={styles.label}>{label}</Text>
      </View>

      <TextInput editable={false} value={value || ''} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: '#4f46e5',
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },

  avatar: {
    width: 110,
    height: 110,
    position: 'relative',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#fff',
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },

  serial: {
    color: 'rgba(255,255,255,.85)',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  inputGroup: {
    marginBottom: 18,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  label: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#334155',
  },

  smallLabel: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#64748b',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#f8fafc',
  },

  locationRow: {
    flexDirection: 'row',
    gap: 12,
  },

  locationField: {
    flex: 1,
  },

  statusCard: {
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusText: {
    marginLeft: 8,
    fontWeight: '600',
  },

  statusValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
  },

  toggleText: {
    fontWeight: '600',
  },
});
