import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';

import axios from 'axios';

import { Search, User, X } from 'lucide-react-native';

export default function UserSelect({ BackendHost, value, onChange }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.post(`${BackendHost}/users`);

      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.phone?.includes(text)
    );
  });
  const selectedUser = users.find((user) => user.id === value?.id);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Assigned User</Text>

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}>
        {selectedUser ? (
          <>
            <Image
              source={{
                uri: selectedUser.profilePicture,
              }}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.name}>{selectedUser.name}</Text>

              <Text style={styles.email}>{selectedUser.email}</Text>
            </View>
          </>
        ) : (
          <>
            <User size={18} color="#64748B" />

            <Text style={styles.placeholder}>Select User</Text>
          </>
        )}
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Select User</Text>

              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.closeIcon}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.searchBox}>
              <Search size={18} color="#64748B" />

              <TextInput
                placeholder="Search user..."
                value={search}
                onChangeText={setSearch}
                style={styles.input}
              />
            </View>

            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                    setSearch('');
                  }}>
                  <Image
                    source={{
                      uri: item.profilePicture,
                    }}
                    style={styles.avatar}
                  />

                  <View>
                    <Text style={styles.name}>{item.name}</Text>

                    <Text style={styles.email}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#334155',
  },

  selector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  placeholder: {
    color: '#64748B',
    fontSize: 15,
  },

  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  email: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },

  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: '80%',
    overflow: 'hidden',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14, 
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  input: {
    flex: 1,
    marginLeft: 10, 
    fontSize: 15,
  },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  closeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
