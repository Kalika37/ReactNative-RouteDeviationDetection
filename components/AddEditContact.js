import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Image,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { X, Camera } from 'lucide-react-native';

export default function ContactFormModal({
  visible,
  onClose,
  title = 'Add Emergency Contact',
  formData,
  setFormData,
  onSubmit,
  errors,
  loading,
}) {
  const relationships = [
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
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (errors.name) {
      nameRef.current?.focus();
    } else if (errors.phone) {
      phoneRef.current?.focus();
    } else if (errors.email) {
      emailRef.current?.focus();
    }
  }, [errors]);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        setFormData({
          ...formData,
          profilePicture: {
            uri: result.assets[0].uri,
            fileName:
              result.assets[0].fileName ||
              result.assets[0].uri.split('/').pop(),
            mimeType: result.assets[0].mimeType || 'image/jpeg',
          },
        });
      } catch (err) {console.log(err)}
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity onPress={onClose}>
              <X size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Profile Image */}

            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {formData.profilePicture ? (
                <Image
                  source={{
                    uri: formData.profilePicture.uri,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Camera size={32} />
                </View>
              )}
              <Text style={styles.imageText}>Change Photo</Text>
              <Text style={styles.formError}>{errors.profilePicture}</Text>
            </TouchableOpacity>

            {/* Name */}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter name"
                value={formData.name}
                ref={nameRef}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    name: text,
                  })
                }
              />
              <Text style={styles.formError}>{errors.name}</Text>
            </View>

            {/* Phone */}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number *</Text>

              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="98XXXXXXXX"
                ref={phoneRef}
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    phone: text,
                  })
                }
              />
              <Text style={styles.formError}>{errors.phone}</Text>
            </View>

            {/* Email */}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                keyboardType="email-address"
                value={formData.email}
                ref={emailRef}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    email: text,
                  })
                }
              />
              <Text style={styles.formError}>{errors.email}</Text>
            </View>

            {/* Relationship */}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Relationship</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.relationship}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      relationship: value,
                    })
                  }>
                  {relationships.map((relationship) => (
                    <Picker.Item
                      key={relationship}
                      label={relationship}
                      value={relationship}
                    />
                  ))}
                  <Text style={styles.formError}>{errors.relationship}</Text>
                </Picker>
              </View>
            </View>

            {/* Primary Contact */}

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Primary Contact</Text>

              <Switch
                value={formData.isPrimary}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    isPrimary: value,
                  })
                }
              />
            </View>

            <Text style={styles.sectionTitle}>Alert Preferences</Text>

            <View style={styles.switchRow}>
              <Text>Receive SMS</Text>

              <Switch
                value={formData.receiveSMS}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    receiveSMS: value,
                  })
                }
              />
            </View>

            <View style={styles.switchRow}>
              <Text>Receive Calls</Text>

              <Switch
                value={formData.receiveCall}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    receiveCall: value,
                  })
                }
              />
            </View>

            <View style={styles.switchRow}>
              <Text>Push Notifications</Text>

              <Switch
                value={formData.receivePushNotification}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    receivePushNotification: value,
                  })
                }
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={onSubmit}
              disabled={loading}>
              <Text style={styles.saveButtonText}>
                {loading
                  ? 'Saving...'
                  : title.includes('Edit')
                  ? 'Update Contact'
                  : 'Add Contact'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formError: {
    color: '#ef4444',
  },
  imageText: {
    marginTop: 10,
    color: '#blue',
    fontWeight: '600',
  },

  formGroup: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  switchLabel: {
    fontWeight: '600',
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
  },

  saveButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 25,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
