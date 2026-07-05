import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Bell,
  ShieldAlert,
  TriangleAlert,
  BatteryWarning,
  MapPin,
  Route,
  Wifi,
  WifiOff,
  UserMinus,
  Megaphone,
  Info,
} from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import BottomNav from './dashboard/BottomNav';
import { useNavigation } from '@react-navigation/native';
import {useConfig} from '../config'

import axios from 'axios';
axios.defaults.withCredentials = true;



const NotificationScreen = () => {
   const { BACKEND_HOST,setCurrentDevice } = useConfig();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(99);
  // Replace with API data
  const [notifications,setNotification] = useState([
    {
      _id: '1',
      title: 'SOS Triggered',
      message: 'Nabin triggered an SOS alert.',
      type: 'sos',
      priority: 'critical',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Battery Low',
      message: 'Device battery is below 15%.',
      type: 'battery_low',
      priority: 'medium',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      _id: '3',
      title: 'Device Offline',
      message: 'Tracker has gone offline.',
      type: 'device_offline',
      priority: 'high',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      _id: '1',
      title: 'SOS Triggered',
      message: 'Nabin triggered an SOS alert.',
      type: 'sos',
      priority: 'critical',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Battery Low',
      message: 'Device battery is below 15%.',
      type: 'battery_low',
      priority: 'medium',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      _id: '3',
      title: 'Device Offline',
      message: 'Tracker has gone offline.',
      type: 'device_offline',
      priority: 'high',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      _id: '1',
      title: 'SOS Triggered',
      message: 'Nabin triggered an SOS alert.',
      type: 'sos',
      priority: 'critical',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Battery Low',
      message: 'Device battery is below 15%.',
      type: 'battery_low',
      priority: 'medium',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      _id: '3',
      title: 'Device Offline',
      message: 'Tracker has gone offline.',
      type: 'device_offline',
      priority: 'high',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ]);
  useEffect(()=>{
    FetchNotifications()
  },[])
  const FetchNotifications = async () => {
    try {
      console.log('sending');
      const res = await axios.post(`${BACKEND_HOST}/notifications`);
      if (res.data.success) {
        
        let countnotread=0
        res.data.notifications.forEach(not=>{
          if(!not.isRead){
            countnotread++
          }
        })
        setUnreadCount(countnotread)
        setNotification(res.data.notifications);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);

    // Fetch notifications

    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'sos':
        return <ShieldAlert size={24} color="#ef4444" />;
      case 'fall_detected':
        return <TriangleAlert size={24} color="#f97316" />;
      case 'battery_low':
        return <BatteryWarning size={24} color="#f59e0b" />;
      case 'location_update':
        return <MapPin size={24} color="#0ea5e9" />;
      case 'route_deviated':
        return <Route size={24} color="#8b5cf6" />;
      case 'device_online':
        return <Wifi size={24} color="#10b981" />;
      case 'device_offline':
        return <WifiOff size={24} color="#ef4444" />;
      case 'contact_removed':
        return <UserMinus size={24} color="#f97316" />;
      case 'announcement':
        return <Megaphone size={24} color="#2563eb" />;
      default:
        return <Bell size={24} color="#64748b" />;
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#2563eb';
      default:
        return '#94a3b8';
    }
  };
  const notificationPressed=async(notification)=>{
    setCurrentDevice(notification.device)
    navigation.navigate('Map');
    try{
      const res = await axios.post(`${BACKEND_HOST}/notifications/onreadread`, {
        notificationId:notification._id
      });
    }catch(err){
      console.log(err)
    }
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, !item.isRead && styles.unreadCard]} onPress={()=>{notificationPressed(item)}}>
      <View style={styles.iconContainer}>{getIcon(item.type)}</View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>

          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor: priorityColor(item.priority),
              },
            ]}
          />
        </View>

        <Text style={styles.message}>{item.message}</Text>

        <View style={styles.footer}>
          <Text style={styles.time}>
            {formatDistanceToNow(new Date(item.createdAt), {
              addSuffix: true,
            })}
          </Text>

          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Alerts</Text>
          <Text style={styles.headerSubtitle}>
            Stay informed about your child's activity
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Bell size={26} color="#2563EB" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Info size={60} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              Notifications will appear here.
            </Text>
          </View>
        }
      />
      <BottomNav active="Alerts" navigation={navigation} paddingbottom={40} />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    color: '#0f172a',
  },

  priorityBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },

  message: {
    marginTop: 6,
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  time: {
    fontSize: 12,
    color: '#94a3b8',
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
  },

  emptyText: {
    marginTop: 8,
    color: '#94a3b8',
    fontSize: 15,
  },
  headerTop: {
    height: 120,
    paddingTop:40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#6B7280',
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
