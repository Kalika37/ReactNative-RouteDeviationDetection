import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  Switch,
  StyleSheet,
} from 'react-native';

export default function ConfirmDialog({
  visible,
  title,
  message,
  remember,
  setRemember,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>

          <Text style={styles.title}>
            ⚠️ {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <View style={styles.rememberRow}>
            <Switch
              value={remember}
              onValueChange={setRemember}
            />

            <Text style={styles.rememberText}>
              Remember my choice
            </Text>
          </View>

          <View style={styles.buttonRow}>

            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={styles.confirmButton}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>
                Confirm
              </Text>
            </Pressable>

          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex:1,
    backgroundColor:'rgba(0,0,0,0.45)',
    justifyContent:'center',
    alignItems:'center',
  },

  dialog:{
    width:'85%',
    backgroundColor:'#fff',
    borderRadius:18,
    padding:22,
    elevation:12,
  },

  title:{
    fontSize:20,
    fontWeight:'700',
    color:'#111827',
    marginBottom:12,
  },

  message:{
    fontSize:15,
    color:'#475569',
    lineHeight:22,
  },

  rememberRow:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:20,
  },

  rememberText:{
    marginLeft:10,
    fontSize:15,
    color:'#111827',
  },

  buttonRow:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginTop:25,
  },

  cancelButton:{
    paddingHorizontal:18,
    paddingVertical:10,
    marginRight:10,
  },

  cancelText:{
    color:'#64748B',
    fontWeight:'600',
    fontSize:15,
  },

  confirmButton:{
    backgroundColor:'#2563EB',
    borderRadius:10,
    paddingHorizontal:18,
    paddingVertical:10,
  },

  confirmText:{
    color:'#fff',
    fontWeight:'700',
    fontSize:15,
  },

});