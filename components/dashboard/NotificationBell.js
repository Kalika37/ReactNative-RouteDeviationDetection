import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { Bell, Clock } from 'lucide-react-native';
const NotificationIcons = {
  Bell: Bell,
};

import TimeAgo from '../../datetime/timeAgo';

export default function NotificationBell({
  notifications = [],
  onNotificationClick = null,
  onViewAll = null,
}) {
  const [open, setOpen] = useState(false);
  let unreadCount = 0;
  notifications.forEach((not) => {
    if (!not.isRead) {
      unreadCount++;
    }
  })
  return (
    <View>
      {/* 🔔 Bell */}
      <TouchableOpacity onPress={() => setOpen(true)}>
        <View style={styles.bellWrapper}>
          <Bell size={22} color="#fff" />

          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* 📩 Dropdown */}
      <Modal transparent visible={open} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

        <View style={styles.menu}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Notifications</Text>

            <TouchableOpacity
              onPress={() => {
                setOpen(false);
                onViewAll?.('Alerts');
              }}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Items */}
          <FlatList
            data={notifications}
            keyExtractor={(item, index) => {
              if (!item) return index.toString();
              return String(item.id ?? index);
            }}
            renderItem={({ item }) => {
              const Icon = NotificationIcons[item.icon];

              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onNotificationClick?.(item);
                    setOpen(false);
                  }}>
                  {/* Icon */}
                  <View style={styles.iconBox}>
                    <Icon size={18} color="#4f46e5" />
                  </View>

                  {/* Content */}
                  <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>

                    <Text style={styles.desc}>{item.description}</Text>

                    <View style={styles.timeRow}>
                      <Clock size={12} color="#888" />
                      <Text style={styles.time}>
                        <TimeAgo date={item.updatedAt} />
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  bellWrapper: {
    padding: 6,
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'red',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  menu: {
    position: 'absolute',
    top: 70,
    right: 15,
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    elevation: 10,
    maxHeight: 400,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  viewAll: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '600',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  desc: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },

  time: {
    fontSize: 11,
    color: '#888',
    marginLeft: 4,
  },
});
