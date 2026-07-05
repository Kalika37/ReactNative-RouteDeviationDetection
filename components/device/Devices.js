import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList, 
  ScrollView,
} from 'react-native';

import axios from 'axios';

import { formatDistanceToNow } from 'date-fns';

import { Search, Smartphone, Eye } from 'lucide-react-native';

import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

axios.defaults.withCredentials = true;

const relativeTime = (date) => {
  if (!date) return 'Never';

  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export default function Devices({ BackendHost, navigation }) {
  const [devices, setDevices] = useState([
    {
      _id: 'd1',
      serialNumber: 'SN-1001',
      deviceId: 'SOS-DEV-001',
      imei: '356938035643809',
      model: 'SmartSOS V1',
      firmwareVersion: '1.0.0',
      batteryLevel: 92,
      status: 'active',
      emergencyMode: false,
      lastSeenAt: '2026-06-11T10:30:00.000Z',
    },
    {
      _id: 'd2',
      serialNumber: 'SN-1002',
      deviceId: 'SOS-DEV-002',
      imei: '356938035643810',
      model: 'SmartSOS V1',
      firmwareVersion: '1.0.2',
      batteryLevel: 45,
      status: 'offline',
      emergencyMode: false,
      lastSeenAt: '2026-06-10T18:12:00.000Z',
    },
    {
      _id: 'd3',
      serialNumber: 'SN-1003',
      deviceId: 'SOS-DEV-003',
      imei: '356938035643811',
      model: 'SmartSOS V2',
      firmwareVersion: '2.0.0',
      batteryLevel: 18,
      status: 'maintenance',
      emergencyMode: false,
      lastSeenAt: '2026-06-11T08:05:00.000Z',
    },
    {
      _id: 'd4',
      serialNumber: 'SN-1004',
      deviceId: 'SOS-DEV-004',
      imei: '356938035643812',
      model: 'SmartSOS V2',
      firmwareVersion: '2.0.1',
      batteryLevel: 67,
      status: 'active',
      emergencyMode: true,
      lastSeenAt: '2026-06-11T12:15:00.000Z',
    },
    {
      _id: 'd5',
      serialNumber: 'SN-1005',
      deviceId: 'SOS-DEV-005',
      imei: '356938035643813',
      model: 'SmartSOS V1',
      firmwareVersion: '1.0.0',
      batteryLevel: 5,
      status: 'lost',
      emergencyMode: false,
      lastSeenAt: '2026-06-09T22:40:00.000Z',
    },
    {
      _id: 'd6',
      serialNumber: 'SN-1006',
      deviceId: 'SOS-DEV-006',
      imei: '356938035643814',
      model: 'SmartSOS V3',
      firmwareVersion: '3.0.0',
      batteryLevel: 100,
      status: 'active',
      emergencyMode: false,
      lastSeenAt: '2026-06-11T15:45:00.000Z',
    },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Devices');

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      console.log("sending..") 
      const response = await axios.post(`${BackendHost}/devices`);
      console.log(response.data)
      if (response.data.success) {
        setDevices(response.data.devices);  
      }
    } catch (error) { 
      console.log(error);    
    }  
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return styles.statusActive;

      case 'offline':
        return styles.statusOffline;

      case 'lost':
        return styles.statusLost;

      case 'maintenance':
        return styles.statusMaintenance;

      default:
        return styles.statusOffline;
    }
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.deviceId
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Devices'
        ? true
        : device.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const renderDevice = ({ item }) => (
    <View style={styles.deviceCard}>
      <View style={styles.deviceTop}>
        <View style={styles.deviceInfo}>
          <Smartphone size={20} color="#4f46e5" />
          <Text style={styles.deviceId}>{item.deviceId}</Text>
        </View>

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() =>
            navigation.navigate('DeviceDetail', {
              serialNumber: item.serialNumber,
            })
          }>
          <Eye size={18} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Model</Text>
        <Text style={styles.value}>{item.model}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Firmware</Text>
        <Text style={styles.value}>{item.firmwareVersion}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Battery</Text>

        <View style={styles.batteryWrapper}>
          <View style={styles.batteryBar}>
            <View
              style={[
                styles.batteryFill,
                {
                  width: `${item.batteryLevel}%`,
                },
              ]}
            />
          </View>

          <Text>{item.batteryLevel}%</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>

        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Emergency</Text>

        <View
          style={item.emergencyMode ? styles.emergencyOn : styles.emergencyOff}>
          <Text style={styles.statusText}>
            {item.emergencyMode ? 'Active' : 'Normal'}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Last Seen</Text>

        <Text style={styles.value}>{relativeTime(item.lastSeenAt)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4f46e5', '#6366f1', '#818cf8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.title}>SOS Devices</Text>

            <Text style={styles.subtitle}>
              Monitor and manage all connected emergency devices
            </Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statNumber}>{devices.length}</Text>
            <Text style={styles.statLabel}>Devices</Text>
          </View>

          <View style={styles.statChip}>
            <Text style={styles.statNumber}>
              {devices.filter((d) => d.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={styles.statChip}>
            <Text style={styles.statNumber}>
              {devices.filter((d) => d.emergencyMode).length}
            </Text>
            <Text style={styles.statLabel}>SOS Mode</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.toolbar}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search device..."
            style={styles.input}
          />
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}>
            <Picker.Item label="All Devices" value="All Devices" />

            <Picker.Item label="Active" value="active" />

            <Picker.Item label="Offline" value="offline" />

            <Picker.Item label="Lost" value="lost" />

            <Picker.Item label="Maintenance" value="maintenance" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={filteredDevices}
        keyExtractor={(item) => item._id || item.serialNumber}
        renderItem={renderDevice}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 18, // was 50+
    paddingBottom: 12, // was 20+
    paddingHorizontal: 20,

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  title: {
    color:'rgba(255,255,255,0.85)',
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },

  statChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8, // was 12
    borderRadius: 12,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },

  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 0,
  },
 
  

  toolbar: {
    marginBottom: 20,
    gap: 12,
  },

  searchBox: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
  },

  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },

  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },

  deviceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deviceId: {
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
  },

  eyeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  label: {
    color: '#64748b',
    fontWeight: '600',
  },

  value: {
    color: '#0f172a',
    fontWeight: '500',
  },

  batteryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  batteryBar: {
    width: 90,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },

  batteryFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontWeight: '600',
    fontSize: 13,
  },

  statusActive: {
    backgroundColor: '#dcfce7',
  },

  statusOffline: {
    backgroundColor: '#fee2e2',
  },

  statusLost: {
    backgroundColor: '#fef3c7',
  },

  statusMaintenance: {
    backgroundColor: '#dbeafe',
  },

  emergencyOn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  emergencyOff: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
