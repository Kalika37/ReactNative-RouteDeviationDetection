import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from 'react-native';

import {
  UserRound,
  Smartphone,
  BatteryFull,
  MapPinned,
  ShieldCheck,
  UsersRound,
  Settings2,
  TriangleAlert,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleCheckBig,
  SquarePen,
} from 'lucide-react-native';

import styles from './styles';
import BottomNav from '../components/dashboard/BottomNav';
import { useNavigation } from '@react-navigation/native';

import LoadingScreen from '../authenticate/LoadingScreen';

import CameraScreen from '../camera/CameraCapture';

import axios from 'axios';
axios.defaults.withCredentials = true;

import { useConfig } from '../config';

export default function ProfileDashboard() {
  const { BACKEND_HOST } = useConfig();
  const [poinerEvents, setPointerEvents] = useState(true);
  const [devices, setDevices] = useState([]);
  const [user, setUser] = useState({});
  const navigation = useNavigation();
  const [selectedDevice, setSelectedDevice] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openCamera, setOpenCamera] = useState(false);

  const quickActions = [
    // {
    //   id: 1,
    //   title: 'Safe Zones',
    //   icon: ShieldCheck,
    //   color: '#4F46E5',
    // },
    // {
    //   id: 2,
    //   title: 'Contacts',
    //   icon: UsersRound,
    //   color: '#10B981',
    // },
    // {
    //   id: 3,
    //   title: 'SOS',
    //   icon: TriangleAlert,
    //   color: '#EF4444',
    // },
    // {
    //   id: 4,
    //   title: 'Settings',
    //   icon: Settings2,
    //   color: '#F59E0B',
    // },
  ];

  const renderAction = ({ item }) => {
    const Icon = item.icon;

    return (
      <TouchableOpacity style={styles.actionCard}>
        <View
          style={[
            styles.actionIcon,
            {
              backgroundColor: item.color,
            },
          ]}>
          <Icon size={24} color="#fff" />
        </View>

        <Text style={styles.actionTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  /*
  ========================= 
  Profile loading 
  =========================
  */

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log(`${BACKEND_HOST}/profileDashboard`);
      const res = await axios.post(`${BACKEND_HOST}/profileDashboard`);
      if (res.data.success) {
        setDevices(res.data.devices);
        setUser(res.data.user);
        setSelectedDevice(res.data.currentDevice);
        console.log(res.data.user);
        setLoading(false);
      }
    } catch (Er) {
      console.log(Er);
    }
  };
  if (loading) {
    return <LoadingScreen />;
  }
  const Logout = () => {};

  const SendSelectedDeviceToBackend = async (device) => {
    try {
      const res = await axios.post(`${BACKEND_HOST}/profileDashboard/select`, {
        id: device.id,
      });
      if (res.data.success) {
        setLoading(false);
        setSelectedDevice(device);
      }
    } catch (Er) {
      console.log(Er);
    }
  };
  const onCameraOpen = () => {
    setOpenCamera(true);
  };
  const onPictureCaptured = (file) => {
    updateImage(file);
    setOpenCamera(false);
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
        response = await axios.post(
          `${BACKEND_HOST}/uploadProfilePicture`,
          fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        fd.append('profilePicture', file);
        response = await axios.post(`${BACKEND_HOST}/uploadProfilePicture`, fd);
      }

      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          profilePicture: file.uri ? file.uri : URL.createObjectURL(file),
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPointerEvents(true);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        poinerEvents={poinerEvents ? 'auto' : 'none'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}>
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={onCameraOpen}>
            <Image
              source={{
                uri: user.profilePicture || 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />

            <View style={styles.editButton}>
              <SquarePen size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{user.name}</Text>

          <Text style={styles.subtitle}>Parent Account</Text>
        </View>
        {/* Current Device */}

        <View style={styles.deviceCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Current Tracking Device</Text>

            <Smartphone size={22} color="#3B82F6" />
          </View>

          <Text style={styles.deviceName}>{selectedDevice.name}</Text>

          <Text style={styles.imei}>IMEI : {selectedDevice.imei}</Text>
          <Text style={styles.imei}>Model : {selectedDevice.model}</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <CircleCheckBig size={18} color="#22C55E" />
              <Text style={styles.statusText}>
                {selectedDevice.active ? 'Online' : 'Offline'}
              </Text>
            </View>

            <View style={styles.statusItem}>
              <BatteryFull size={18} color="#22C55E" />
              <Text style={styles.statusText}>
                {selectedDevice.batteryLevel}%
              </Text>
            </View>

            <View style={styles.statusItem}>
              <MapPinned size={18} color="#3B82F6" />
              <Text style={styles.statusText}>
                {selectedDevice.active ? 'GPS Active' : 'Gps Not Active'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.selectText}>Select Device</Text>

            <ChevronDown size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Management</Text>

          <FlatList
            data={quickActions}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
            renderItem={renderAction}
          />
        </View>

        {/* Account */}

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Email</Text>

              <Text style={styles.infoValue}>{user.email}</Text>
            </View>

            <ChevronRight size={18} color="#94A3B8" />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Phone</Text>

              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>

            <ChevronRight size={18} color="#94A3B8" />
          </View>
        </View>

        {/* Logout */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={(e) => {
            Logout();
          }}>
          <UserRound size={20} color="#EF4444" />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav navigation={navigation} active="Profile" paddingbottom={40} />
      {/* Device Modal */}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Device</Text>

            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceItem}
                onPress={() => {
                  SendSelectedDeviceToBackend(device);
                  setModalVisible(false);
                }}>
                <View>
                  <Text style={styles.deviceItemName}>{device.name}</Text>

                  <Text style={styles.deviceItemImei}>{device.imei}</Text>
                </View>

                {selectedDevice.id === device.id ? (
                  <CircleCheckBig size={22} color="#3B82F6" />
                ) : (
                  <Circle size={22} color="#CBD5E1" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CameraScreen onCaptured={onPictureCaptured} visible={openCamera} />
    </SafeAreaView>
  );
}
