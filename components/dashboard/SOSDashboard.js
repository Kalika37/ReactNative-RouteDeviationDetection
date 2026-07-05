import React, { useRef, useState, useEffect } from 'react';
import { Animated } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Menu,
  Shield,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Phone,
  MapPin,
  User,
  Plus,
  MessageCircle,
} from 'lucide-react-native';
import SideDrawer from './sideDrawer';
import NotificationBell from './NotificationBell';
import BottomNav from './BottomNav';
import ContactFormModal from '../AddEditContact';
import { useAuth } from '../../authenticate/AuthProvider';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { getDeviceId } from '../auth/deviceUtils';
import { useConfig } from '../../config';

import LoadingScreen from '../../authenticate/LoadingScreen';

export default function SOSDashboard({ BackendHost }) {
  //contact
  const { setCurrentDevice } = useConfig();
  const { setAuthenticated } = useAuth();
  const [addFormErrors, setAddFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  const [showAddContact, setShowAddContact] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    profilePicture: {
      uri: null,
      fileName: null,
      mimeType: null,
    },
    name: '',
    phone: '',
    email: '',
    relationship: 'Father',
    isPrimary: false,
    receiveSMS: true,
    receiveCall: true,
    receivePushNotification: true,
  });

  const [editForm, setEditForm] = useState({
    profilePicture: {
      uri: null,
      fileName: null,
      mimeType: null,
    },
    id: '',
    name: '',
    phone: '',
    email: '',
    relationship: 'Father',
    isPrimary: false,
    receiveSMS: true,
    receiveCall: true,
    receivePushNotification: true,
  });

  //form validator
  const validateGuardianForm = (formData) => {
    const errors = {};

    // Name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!/^[A-Za-z\s.'-]+$/.test(formData.name.trim())) {
      errors.name = 'Name contains invalid characters';
    }

    // Phone (Nepal)
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const phone = formData.phone.replace(/\s+/g, '');

      // Accepts:
      // 98XXXXXXXX
      // 97XXXXXXXX
      // 96XXXXXXXX
      // +97798XXXXXXXX
      // +97797XXXXXXXX
      // +97796XXXXXXXX
      const nepaliPhoneRegex = /^(?:\+977)?9[678]\d{8}$/;

      if (!nepaliPhoneRegex.test(phone)) {
        errors.phone = 'Enter a valid Nepali mobile number';
      }
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Enter a valid email address';
      }
    }

    // Relationship
    const allowedRelationships = [
      'Father',
      'Mother',
      'Brother',
      'Sister',
      'Grandfather',
      'Grandmother',
      'Uncle',
      'Aunt',
      'Guardian',
      'Friend',
      'Relative',
      'Neighbor',
      'Teacher',
      'Caregiver',
      'Babysitter',
      'Other',
    ];

    if (!allowedRelationships.includes(formData.relationship)) {
      errors.relationship = 'Please select a valid relationship';
    }

    // Profile Picture (optional)
    if (formData.profilePicture) {
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];

      if (
        formData.profilePicture.type &&
        !allowedTypes.includes(formData.profilePicture.type)
      ) {
        errors.profilePicture = 'Profile picture must be JPG, PNG, or WEBP';
      }

      // Optional: max 5 MB
      if (
        formData.profilePicture.fileSize &&
        formData.profilePicture.fileSize > 5 * 1024 * 1024
      ) {
        errors.profilePicture = 'Profile picture must be less than 5 MB';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  const createContactFormData = (data) => {
    const body = new FormData();

    body.append('name', data.name.trim());
    body.append('contactId', data.id);
    body.append('phone', data.phone.trim());
    body.append('email', data.email.trim());
    body.append('relationship', data.relationship);
    body.append('isPrimary', String(data.isPrimary));
    body.append('receiveSMS', String(data.receiveSMS));
    body.append('receiveCall', String(data.receiveCall));
    body.append(
      'receivePushNotification',
      String(data.receivePushNotification)
    );

    if (data.profilePicture) {
      body.append('profilePicture', {
        uri: data.profilePicture.uri,
        name: data.profilePicture.fileName,
        type: data.profilePicture.mimeType,
      });
    }

    return body;
  };
  const handleAddContact = async () => {
    const { isValid, errors } = validateGuardianForm(formData);
    console.log(errors, isValid);
    if (!isValid) {
      setAddFormErrors(errors);
      return;
    }
    const newContact = {
      contactId: Date.now().toString(),
      ...formData,
    };
    try {
      const res = await axios.post(
        `${BackendHost}/emergency-contact`,
        createContactFormData(newContact)
      );
      if (res.data.success) {
        setContacts((prev) => [...prev, res.data.contact]);
        setFormData({
          profilePicture: {
            uri: null,
            fileName: null,
            mimeType: null,
          },
          name: '',
          phone: '',
          email: '',
          relationship: 'Father',
          isPrimary: false,
          receiveSMS: true,
          receiveCall: true,
          receivePushNotification: true,
        });

        setShowAddContact(false);
      }
    } catch (err) {
      if (err?.response?.errors) {
        setAddFormErrors(err?.response?.errors);
      }
    }
    //add contacts
  };
  const [user, setUser] = useState({
    name: 'Nabin',
    profilePicture: 'https://i.pravatar.cc/150?img=12',
  });

  //notification

  const [notifications, setNotification] = useState([]);
  //side menu propper
  const [menuOpen, setMenuOpen] = useState(false);

  const [contacts, setContacts] = useState([]);

  const handleUpdateContact = async () => {
    const { isValid, errors } = validateGuardianForm(editForm);
    if (!isValid) {
      if (errors) {
        setEditFormErrors(errors);
      }
      return;
    }

    const newContact = {
      ...editForm,
    };
    // return
    try {
      const res = await axios.put(
        `${BackendHost}/emergency-contact`,
        createContactFormData(newContact)
      );
      if (res.data.success) {
        setContacts([
          ...contacts.filter((cont) => {
            return cont.id != newContact.id;
          }),
          res.data.contact,
        ]);
        console.log(res.data);
        setEditForm({
          profilePicture: {
            uri: null,
            fileName: null,
            mimeType: null,
          },
          name: '',
          phone: '',
          email: '',
          relationship: 'Father',
          isPrimary: false,
          receiveSMS: true,
          receiveCall: true,
          receivePushNotification: true,
        });

        setShowEditContact(false);
      } else {
        console.log('failed');
      }
    } catch (err) {
      console.log(err, err?.response?.errors, err?.response?.message);
      if (err?.response?.errors) {
        setEditFormErrors(err?.response?.errors);
      }
    }
  };
  //sos ring animatino
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.2,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.6,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();

    FetchAll();
  }, []);
  const navigation = useNavigation();
  const FetchAll = async () => {
    await FetchUser();
    await FetchContacts();
    await FetchNotifications();
    setLoading(false);
  };
  const FetchContacts = async () => {
    try {
      const res = await axios.post(`${BackendHost}/emergency-contacts`);
      if (res.data.success) {
        setContacts(res.data.contacts);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const FetchNotifications = async () => {
    try {
      const res = await axios.post(`${BackendHost}/notifications`);
      if (res.data.success) {
        
        setNotification(res.data.notifications);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const FetchUser = async () => {
    try {
      const res = await axios.post(`${BackendHost}/profileDashboard`);
      if (res.data.success) {
        res.data.user.name = res.data.user.name.split(' ')[0];
        setUser(res.data.user);
        console.log(res.data.currentDevice);
        setCurrentDevice(res.data.currentDevice);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const makeCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const sendSMS = (phone) => {
    Linking.openURL(`sms:${phone}`);
  };

  const onNotificationClick = async (notification) => {
    setCurrentDevice(notification.device);
    navigation.navigate('Map');
    try {
      const res = await axios.post(`${BackendHost}/notifications/onreadread`, {
        notificationId: notification._id,
      });
    } catch (err) {
      console.log(err);
    }
  }; 
  const onViewAllNotifications = () => {
    navigation.navigate('Alerts');
  };
  const OnViewAllContacts = () => {
    navigation.navigate('Contacts');
  };
  const onEditContact = (contact) => {
    setShowEditContact(true);
    setSelectedContact(contact);
    setEditForm({ ...contact, ContactID: contact.id });
  };

  const logout = async () => {
    const deviceId = await getDeviceId();
    await axios.post(`${BackendHost}/logout`, { deviceId });
    verifyUser();
    // setAuthenticated(false);
  };
  const onAdmin = () => {
    navigation.navigate('Admin');
  };
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SideDrawer
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onProfile={() => navigation.navigate('Profile')}
        onDevices={() => navigation.navigate('Devices')}
        onAdmin={() => onAdmin()}
        onLogout={() => {
          setMenuOpen(false);
          logout();
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Menu color="#fff" size={24} />
          </TouchableOpacity>

          <NotificationBell
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onViewAll={onViewAllNotifications}
          />
        </View>
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.title}>Hi, {user.name} 👋</Text>

            <Text style={styles.subtitle}>You are protected</Text>
          </View>

          <Image
            source={{
              uri: user.profilePicture || 'https://i.pravatar.cc/150?img=12',
            }}
            style={styles.avatar}
          />
        </View>
        {/* SOS Button */}
        <View style={styles.sosWrapper}>
          <View style={styles.ringContainer}>
            {/* Outer Ring */}
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: fadeAnim,
                },
              ]}
            />

            {/* Second Ring */}
            <Animated.View
              style={[
                styles.pulseRing2,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: fadeAnim,
                },
              ]}
            />

            {/* Shield Badge */}
            <View style={styles.shieldBadge}>
              <ShieldAlert size={16} color="#fff" />
            </View>

            {/* SOS Button */}
            <TouchableOpacity style={styles.sosButton}>
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.tapText}>TAP TO ALERT</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.info}>
          Press the button in an emergency
          {'\n'}
          Your location will be shared
        </Text>
        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard}>
            <Phone size={28} color="#45d6ff" />
            <Text style={styles.actionTitle}>Fake Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <MapPin size={28} color="#45d6ff" />
            <Text style={styles.actionTitle}>Share Live</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Shield size={28} color="#45d6ff" />
            <Text style={styles.actionTitle}>I'm Safe</Text>
          </TouchableOpacity>
        </View>
        {/* Contacts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddContact(true)}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactCard}
            onPress={() => {
              onEditContact(contact);
            }}>
            <View style={styles.contactLeft}>
              <View style={styles.contactAvatar}>
                {contact.profilePicture ? (
                  <Image
                    source={{
                      uri:
                        contact.profilePicture ||
                        'https://i.pravatar.cc/150?img=12',
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <User size={18} color="#fff" />
                )}
              </View>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>

                <Text style={styles.contactPhone}>+977 {contact.phone}</Text>
              </View>
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => makeCall(contact.phone)}>
                <Phone size={18} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.msgBtn}
                onPress={() => sendSMS(contact.phone)}>
                <MessageCircle size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        {contacts.length > 0 && (
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={OnViewAllContacts}>
            <Text style={styles.viewAllText}>View All Contacts</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <ContactFormModal
        visible={showAddContact}
        onClose={() => setShowAddContact(false)}
        title="Add Emergency Contact"
        formData={formData}
        errors={addFormErrors}
        setFormData={setFormData}
        onSubmit={handleAddContact}
      />

      <ContactFormModal
        visible={showEditContact}
        onClose={() => setShowEditContact(false)}
        title="Edit Emergency Contact"
        formData={editForm}
        errors={editFormErrors}
        setFormData={setEditForm}
        onSubmit={handleUpdateContact}
      />
      <BottomNav navigation={navigation} active="Dashboard" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111f',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greetingRow: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    color: '#9aa7c2',
    marginTop: 6,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  shieldBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',

    width: 34,
    height: 34,
    borderRadius: 17,

    backgroundColor: '#ef4444',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#07111f',

    zIndex: 99,
  },
  pulseRing: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,59,92,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pulseRing2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,59,92,0.15)',
  },

  ringContainer: {
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sosButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#ff3b5c',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  sosText: {
    color: '#fff',
    fontSize: 52,
    fontWeight: '800',
  },

  tapText: {
    color: '#fff',
    fontSize: 12,
  },

  info: {
    textAlign: 'center',
    color: '#9aa7c2',
    marginTop: 15,
    lineHeight: 22,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  actionCard: {
    width: '31%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },

  actionTitle: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 35,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 15,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: '#ff3b5c',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5,
  },
  contactCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#213657',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  contactName: {
    color: '#fff',
    fontWeight: '600',
  },

  contactPhone: {
    color: '#9aa7c2',
    marginTop: 4,
  },

  contactActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewAllBtn: {
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 14,

    backgroundColor: 'rgba(255,255,255,0.06)',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  viewAllText: {
    color: '#45d6ff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1ec25d',
    justifyContent: 'center',
    alignItems: 'center',
  },

  msgBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27334f',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
