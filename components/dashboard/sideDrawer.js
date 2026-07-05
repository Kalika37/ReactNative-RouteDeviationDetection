import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  PanResponder,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { User, Smartphone, LogOut, ShieldCheck, X } from 'lucide-react-native';

const DRAWER_WIDTH = 300;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SideDrawer({
  visible,
  onClose,
  user,
  onProfile,
  onDevices,
  onAdmin,
  onLogout,
}) {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const isOpen = useRef(false);

  // ---------- OPEN ----------
  const openDrawer = () => {
    isOpen.current = true;

    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
    }).start();

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // ---------- CLOSE ----------
  const closeDrawer = () => {
    isOpen.current = false;

    Animated.spring(translateX, {
      toValue: -DRAWER_WIDTH,
      useNativeDriver: true,
      friction: 10,
      tension: 90,
    }).start();

    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();

    setTimeout(() => onClose?.(), 200);
  };

  useEffect(() => {
    if (visible) openDrawer();
    else closeDrawer();
  }, [visible]);

  // ---------- SWIPE GESTURE ----------
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          translateX.setValue(Math.max(gesture.dx, -DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -120) {
          closeDrawer();
        } else {
          openDrawer();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
      {/* BLUR / OVERLAY */}
      <Animated.View style={[styles.overlay, { opacity }]}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        <Pressable style={{ flex: 1 }} onPress={closeDrawer} />
      </Animated.View>

      {/* DRAWER */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.drawer, { transform: [{ translateX }] }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Image
              source={{
                uri: user?.profilePicture || 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.name}>{user?.name || 'User'}</Text>
              <Text style={styles.status}>Stay Safe 🛡️</Text>
            </View>
          </View>

          <TouchableOpacity onPress={closeDrawer}>
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              closeDrawer();
              onProfile?.();
            }}>
            <User size={20} color="#4f46e5" />
            <Text style={styles.itemText}>Profile</Text>
          </TouchableOpacity>

          {user.role === 'Admind' ? (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onAdmin?.();
                closeDrawer();
              }}>  
              <Smartphone size={20} color="#4f46e5" />
              <Text style={styles.itemText}>Admin</Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
          
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              closeDrawer();
              onDevices?.();
            }}>
            <Smartphone size={20} color="#4f46e5" />
            <Text style={styles.itemText}>Devices</Text>
          </TouchableOpacity>
          

          <TouchableOpacity
            style={[styles.item, styles.logout]}
            onPress={() => {
              closeDrawer();
              onLogout?.();
            }}>
            <LogOut size={20} color="#ef4444" />
            <Text style={[styles.itemText, { color: '#ef4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <ShieldCheck size={16} color="#666" />
          <Text style={styles.footerText}>Protected by SmartSOS</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
    elevation: 20,
  },

  header: {
    backgroundColor: '#6366f1',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  status: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },

  menu: {
    padding: 16,
    gap: 12,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
  },

  itemText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },

  logout: {
    backgroundColor: '#fff1f2',
  },

  footer: {
    marginTop: 'auto',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
});
