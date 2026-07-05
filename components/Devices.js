import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import CameraScreen from '../camera/CameraCapture';

const alerts = [
  { id: '1', message: 'SOS Alert from Device A001' },
  { id: '2', message: 'Low Battery Device B002' },
  { id: '3', message: 'Geofence Breach' },
];

export default function Alerts() {
  const [show, setShow] = useState(false);
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity
        onPress={() => {
          setShow(true);
        }}>
        jj jkjk
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Alerts</Text>
      </TouchableOpacity>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={{
              padding: 15,
              backgroundColor: '#fff',
              marginVertical: 5,
              borderRadius: 10,
            }}>
            {item.message}
          </Text>
        )}
      />
      <CameraScreen
        visible={show}
        onCaptured={(photo) => {
          setShow(false);
        }}
      />
    </View>
  );
}
