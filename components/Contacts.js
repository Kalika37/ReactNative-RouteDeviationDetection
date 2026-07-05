import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Shield,
  User,
  Phone,
  MessageCircle,
  Pencil,
  Star,
  HeartHandshake,
  Plus,
  Bell,
  ChevronRight,
} from 'lucide-react-native';

import ContactFormModal from './AddEditContact';

export default function EmergencyContactsScreen() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [formData, setFormData] = useState({
    profilePicture: null,
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
    profilePicture: null,
    name: '',
    phone: '',
    email: '',
    relationship: 'Father',
    isPrimary: false,
    receiveSMS: true,
    receiveCall: true,
    receivePushNotification: true,
  });

  const [loading, setLoading] = useState(false);

  const handleAddContact = () => {
    const newContact = {
      id: Date.now().toString(),
      ...formData,
    };

    setContacts((prev) => [...prev, newContact]);

    setFormData({
      profilePicture: null,
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
  };
  const handleUpdateContact = () => {
    setContacts((prev) =>
      prev.map((contact) => (contact.id === editForm.id ? editForm : contact))
    );

    setShowEditContact(false);
  };

  const contacts = [
    {
      id: '1',
      name: 'Bikash Pokharel',
      phone: '9861591138',
      relationship: 'Brother',
      isPrimary: true,
      profilePicture: null,
    },
    {
      id: '2',
      name: 'Sita Pokharel',
      phone: '9841234567',
      relationship: 'Mother',
      isPrimary: false,
      profilePicture: null,
    },
    {
      id: '3',
      name: 'Ram Pokharel',
      phone: '9856789123',
      relationship: 'Father',
      isPrimary: false,
      profilePicture: null,
    },
  ];

  const onEditContact = (contact) => {
    setShowEditContact(true);
    setSelectedContact(contact);
    setEditForm(contact);
  };
  const onAddContact = () => {
    setShowAddContact(true);
  };
  const makeAPhoneCall = (phone) => {
    console.log(phone);
    Linking.openURL(`tel:${phone}`);
  };
  const sendAMessage = (phone) => {
    Linking.openURL(`sms:${phone}`);
  };
  const renderContact = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.contactCard, item.isPrimary && styles.primaryCard]}>
      {/* TOP */}

      <View style={styles.cardTop}>
        {item.profilePicture ? (
          <Image
            source={{
              uri: item.profilePicture,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User size={34} color="#ef4444" />
          </View>
        )}

        <View style={styles.contactInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>

            {item.isPrimary && (
              <View style={styles.primaryBadge}>
                <Star size={12} color="#fff" fill="#fff" />

                <Text style={styles.badgeText}>PRIMARY</Text>
              </View>
            )}
          </View>

          <View style={styles.relationshipContainer}>
            <HeartHandshake size={14} color="#64748b" />

            <Text style={styles.relationship}>{item.relationship}</Text>
          </View>

          <View style={styles.phoneRow}>
            <Phone size={14} color="#64748b" />

            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        </View>

        <ChevronRight size={20} color="#cbd5e1" />
      </View>

      {/* ACTIONS */}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => {
            makeAPhoneCall(item.phone);
          }}>
          <Phone size={18} color="#fff" />

          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smsButton}
          onPress={() => {
            sendAMessage(item.phone);
          }}>
          <MessageCircle size={18} color="#fff" />

          <Text style={styles.actionText}>SMS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            onEditContact(item);
          }}>
          <Pencil size={18} color="#fff" />

          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerIcon}>
            <Shield size={22} color="#fff" />
          </View>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Emergency Contacts</Text>

            <Text style={styles.headerSubtitle}>Trusted SOS recipients</Text>
          </View>

          <TouchableOpacity>
            <Bell size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* STATS */}

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <User size={20} color="#ef4444" />

          <Text style={styles.statNumber}>{contacts.length}</Text>

          <Text style={styles.statText}>Contacts</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Bell size={20} color="#ef4444" />

          <Text style={styles.statNumber}>Active</Text>

          <Text style={styles.statText}>Alerts</Text>
        </View>
      </View>

      {/* CONTACTS */}

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          onAddContact();
        }}>
        <Plus size={30} color="#fff" />
      </TouchableOpacity>
      <ContactFormModal
        visible={showAddContact}
        onClose={() => setShowAddContact(false)}
        title="Add Emergency Contact"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddContact}
      />

      <ContactFormModal
        visible={showEditContact}
        onClose={() => setShowEditContact(false)}
        title="Edit Emergency Contact"
        formData={editForm}
        setFormData={setEditForm}
        onSubmit={handleUpdateContact}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    backgroundColor: '#ef4444',

    paddingTop: 12,
    paddingBottom: 18,
    paddingHorizontal: 20,

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: 'rgba(255,255,255,0.18)',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: '#fff',

    marginHorizontal: 16,
    marginTop: -12,

    borderRadius: 18,

    flexDirection: 'row',
    justifyContent: 'space-around',

    paddingVertical: 14,

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 5,
  },

  statText: {
    color: '#64748b',
    marginTop: 2,
  },

  divider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },

  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 18,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },

  primaryCard: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contactInfo: {
    flex: 1,
    marginLeft: 14,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  primaryBadge: {
    marginLeft: 8,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },

  relationshipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  relationship: {
    marginLeft: 5,
    color: '#64748b',
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  phone: {
    marginLeft: 5,
    color: '#64748b',
  },

  actions: {
    flexDirection: 'row',
    marginTop: 18,
  },

  callButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  smsButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  actionText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30,

    width: 68,
    height: 68,
    borderRadius: 34,

    backgroundColor: '#ef4444',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 10,

    shadowColor: '#ef4444',
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
});
