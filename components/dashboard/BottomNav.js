import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Bell, Shield, User, Map } from 'lucide-react-native';

export default function BottomNav({ navigation, active = 'Dashboard', paddingbottom=0 }) {
  const tabs = [
    { name: 'Dashboard', icon: Home },
    { name: 'Alerts', icon: Bell },
    { name: 'LiveTracking', icon: Map },
    { name: 'Profile', icon: User },
  ];
  const tabClicked = (tab) => {
    if (tab === 'Dashboard' && active!=tab) {
      navigation.navigate('App', {
        screen: 'Dashboard',
      })
    }
    if (tab === 'Alerts' && active!=tab) {
      navigation.navigate('App', {
        screen: 'Alerts',
      })
    }
    if (tab === 'LiveTracking' && active!=tab) {
      navigation.navigate('Map', {
        screen: 'LiveTracking',
      })
    }
    if (tab === 'Profile' && active!=tab) {
      navigation.navigate('App', {
        screen: 'Profile',
      })
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: paddingbottom }]}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => tabClicked(tab.name)}>
            <Icon size={22} color={isActive ? '#ff3b5c' : '#9aa7c2'} />

            <Text
              style={[
                styles.label,
                { color: isActive ? '#ff3b5c' : '#9aa7c2' },
              ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0b1526',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'space-between',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
});
