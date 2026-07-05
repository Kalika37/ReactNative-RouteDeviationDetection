import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ onCaptured = null, visible = true }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off'); // off | on | auto
  const [zoom, setZoom] = useState(0);
  const [grid, setGrid] = useState(true);

  const [timer, setTimer] = useState(0); // 0,3,5,10
  const [countdown, setCountdown] = useState(null);

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const toggleFacing = () => {
    setFacing((p) => (p === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((p) => {
      if (p === 'off') return 'on';
      if (p === 'on') return 'auto';
      return 'off';
    });
  };

  const cycleTimer = () => {
    setTimer((p) => {
      if (p === 0) return 3;
      if (p === 3) return 5;
      if (p === 5) return 10;
      return 0;
    });
  };

  const captureNow = async () => {
    if (!cameraRef.current) return;

    const pic = await cameraRef.current.takePictureAsync({
      quality: 1,
    });
    
    setPhoto(pic);
    setCountdown(null);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    if (timer > 0) {
      setCountdown(timer);

      let current = timer;

      const interval = setInterval(() => {
        current -= 1;
        setCountdown(current);

        if (current <= 0) {
          clearInterval(interval);
          captureNow();
        }
      }, 1000);
    } else {
      captureNow();
    }
  };
  const RequestToUseImage=()=>{
    onCaptured?.(photo)
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.center}>
          <Text style={{ color: '#fff' }}>Camera permission required</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.btn}>
            <Text style={{ color: '#fff' }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  if (photo) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} />

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setPhoto(null)}>
              <Text style={{ color: '#fff' }}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, styles.useBtn]} onPress={RequestToUseImage}>
              <Text style={{ color: '#fff' }}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash}
          zoom={zoom}
        />

        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />

        {grid && (
          <View style={styles.grid}>
            <View style={styles.lineV1} />
            <View style={styles.lineV2} />
            <View style={styles.lineH1} />
            <View style={styles.lineH2} />
          </View>
        )}

        {countdown !== null && (
          <View style={styles.countdown}>
            <Text style={styles.countText}>{countdown}</Text>
          </View>
        )}

        <SafeAreaView style={styles.safe}>
          {/* TOP */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={toggleFlash}>
              <Ionicons name="flash" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={cycleTimer}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>
                {timer === 0 ? 'OFF' : `${timer}s`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setGrid(!grid)}>
              <Ionicons name="grid" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* CENTER GUIDE */}
          <View style={styles.guideBox} />

          {/* BOTTOM */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.sideBtn} onPress={toggleFacing}>
              <Ionicons name="camera-reverse" size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePhoto}>
              <LinearGradient
                colors={['#7C3AED', '#4F46E5', '#2563EB']}
                style={styles.captureOuter}>
                <View style={styles.captureInner} />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.zoomBox}>
              <TouchableOpacity
                onPress={() => setZoom(Math.max(0, zoom - 0.1))}>
                <Text style={{ color: '#fff' }}>-</Text>
              </TouchableOpacity>

              <Text style={{ color: '#fff' }}>
                {(zoom * 10 + 1).toFixed(1)}x
              </Text>

              <TouchableOpacity
                onPress={() => setZoom(Math.min(1, zoom + 0.1))}>
                <Text style={{ color: '#fff' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position:"fixed",
    top:0,
    left:0,
    width:width,
    height:height
  },
  safe: { flex: 1, justifyContent: 'space-between' },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  btn: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
  },

  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 12,
  },

  guideBox: {
    width: width * 0.7,
    height: width * 1.0,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    marginTop: 20,
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 30,
  },

  sideBtn: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
  },

  captureOuter: {
    width: 85,
    height: 85,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureInner: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: '#fff',
  },

  zoomBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  countdown: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    borderRadius: 100,
  },

  countText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
  },

  grid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  lineV1: {
    position: 'absolute',
    left: '33%',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  lineV2: {
    position: 'absolute',
    left: '66%',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  lineH1: {
    position: 'absolute',
    top: '33%',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  lineH2: {
    position: 'absolute',
    top: '66%',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  previewImage: {
    flex: 1,
  },

  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },

  actionBtn: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },

  useBtn: {
    backgroundColor: '#4F46E5',
  },
});
