import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { MapPin, Locate } from 'lucide-react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
axios.defaults.withCredentials = true;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/* =========================
   Helpers
========================= */
import { useNavigation } from '@react-navigation/native';

/* =========================
   Smart placement logic
========================= */
import { getDistance } from 'geolib';

import ChildMarker from '../assets/child-marker.png';

function findClosestIndex(route, child) {
  let minDistance = Infinity;
  let index = 0;

  route.forEach((point, i) => {
    const d = getDistance(
      {
        latitude: point.latitude,
        longitude: point.longitude,
      },
      child
    );

    if (d < minDistance) {
      minDistance = d;
      index = i;
    }
  });

  return index;
}

/* =========================
   Context Menu (Google style)
========================= */

/* =========================
   Main Component
========================= */

import { useConfig } from '../config';

import BottomNav from '../components/dashboard/BottomNav';
import LoadingScreen from '../authenticate/LoadingScreen';

export default function RouteLiveTracking() {
  const { BACKEND_HOST, currentDevice } = useConfig();
  const mapRef = useRef(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // ✅ ADD THIS

  const [homeToSchool, setHomeToSchool] = useState(true);

  const [completedRoute, setCompletedRoute] = useState([currentStart]);
  const [remainingRoute, setRemainingRoute] = useState([]);

  const [homeLocation, setHomeLocation] = useState({
    latitude: 27.694583,
    longitude: 85.381716,
  });

  const [schoolLocation, setSchoolLocation] = useState({
    latitude: 27.661139,
    longitude: 85.373988,
  });

  const [childLocation, setchildLocation] = useState({
    latitude: 27.6752,
    longitude: 85.3521,
  });

  /* =========================
     Load routes
  ==[]======================= */

  const [MapRouteFetchedFromBackend, setMapRouteFetchedFromBackend] =
    useState(false);
  useEffect(() => {
    if (MapRouteFetchedFromBackend) {
      loadRoutes();
    } else {
      console.log('fetching');
      loadCurrentRoute();
    }
  }, []);

  /* =========================
     Loading datas
  ========================= */
  const loadRoutes = async () => {
    try {
      setLoading(true);
      const start = homeToSchool ? homeLocation : schoolLocation;
      const end = homeToSchool ? schoolLocation : homeLocation;
      const url = `https://router.project-osrm.org/route/v1/walking/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&alternatives=true`;
      const res = await axios.get(url);

      const fetched = res?.data?.routes || [];
      const all = fetched.map((r) =>
        r.geometry.coordinates.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }))
      );
      const rt = all[0];
      setRoutes(all);
      onChildChangePosition(rt[Math.floor(Math.random() * rt.length)], rt);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };
  const loadCurrentRoute = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BACKEND_HOST}/api/route/getCurrentRoute`,
        {
          deviceId: currentDevice.id,
        }
      );
      if (res.data.success) {
        setMapRouteFetchedFromBackend(true);
        setHomeLocation(res.data.start);
        setSchoolLocation(res.data.end);
        setSelectedRoute(res.data.index);
        setHomeToSchool(res.data.hometoschool);
        console.log(res.data);
        loadRoutes();
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to load routes');
    } finally {
      // setLoading(false);
    }
  };

  const currentStart = homeToSchool ? homeLocation : schoolLocation;
  const currentEnd = homeToSchool ? schoolLocation : homeLocation;

  /* =========================
     Updating child live location
  ==[]======================= */
  const currentRoute = routes[0] || [];

  const onChildChangePosition = (position, rt) => {
    const closestIndex = findClosestIndex(rt, position);
    setchildLocation(position);
    setCompletedRoute([
      ...rt.slice(0, closestIndex),
      position, // make the line end exactly at the child's position
    ]);
    setRemainingRoute([position, ...rt.slice(closestIndex)]);
  };
  useEffect(() => {
    if (currentRoute.length > 0) {
      mapRef.current?.animateCamera(
        {
          center: childLocation,
          zoom: 13,
        },
        { duration: 500 }
      );
    }
  }, [currentRoute]);
  if (loading || routes.length == 0) {
    return <LoadingScreen />;
  }

  const PickAnotherRoute = () => {
    navigation.navigate('Map', {
      screen: 'RoutePicker',
    });
  };

  /* =========================
     UI
  ========================= */

  return (
    <Pressable style={styles.container}>
      <View style={styles.container}>
        {/* Sidebar */}
        {/* SIDEBAR */}

        {/* Map */}
        <View style={styles.mapWrapper}>
          <MapView
            key={`map-${selectedRoute}`} // 🔥 FORCE RE-RENDER FIX
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: currentStart.latitude,
              longitude: currentStart.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}>
            <Polyline
              coordinates={currentRoute}
              strokeColor="#9CA3AF"
              strokeWidth={5}
              lineDashPattern={[12, 8]}
              lineCap="round"
              zIndex={1}
            />
            <Polyline
              coordinates={completedRoute}
              strokeColor="blue"
              strokeWidth={7}
            />

            <Polyline
              coordinates={remainingRoute}
              strokeColor="red"
              strokeWidth={7}
            />
            <Marker coordinate={currentStart} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.startDotOuter}>
                <View style={styles.startDotInner} />
              </View>
            </Marker>
            <Marker
              coordinate={childLocation}
              image={ChildMarker}
              anchor={{ x: 0.5, y: 1 }}
            />

            <Marker coordinate={currentEnd} />
          </MapView>
        </View>
        <View style={[styles.routeSidebar, { width: SCREEN_WIDTH }]}>
          {/* TOP BAR */}

          <View style={styles.sidebarTopRow}>
            <Text style={styles.sidebarHeader}>Your Route</Text>
            <TouchableOpacity
              style={styles.Picker}
              onPress={() => {
                PickAnotherRoute();
              }}>
              <MapPin size={18} color="#EF4444" strokeWidth={2.5} />

              <Text style={styles.PickText}>Pick Map</Text>
            </TouchableOpacity>
          </View>

          {/* FULL SIDEBAR */}
          {/* Direction box */}
          <View style={styles.directionBox}>
            <Text style={styles.directionText}>
              {homeToSchool ? 'Home → School' : 'School → Home'}
            </Text>
          </View>
        </View>
        <BottomNav
          navigation={navigation}
          active="LiveTracking"
          paddingbottom={40}
        />
      </View>
    </Pressable>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Picker: {
    // flex:1,
    width: 80,
    justifyContent: 'center', // Centers text vertically on main axis
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
    margin: 0,
    backgroundColor: 'skyblue',
    color: 'white',
    borderRadius: 5,
  },
  PickText: {
    color: 'red',
  },
  startDotOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(37, 99, 235, 0.35)', // soft blue glow
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
  },

  startDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563eb', // solid Google blue
  },

  /* =========================
     MAP
  ========================= */

  mapWrapper: {
    flex: 1,
    position: 'relative',
  },

  map: {
    flex: 1,
  },

  /* =========================
     SIDEBAR
  ========================= */

  routeSidebar: {
    height: 50,
    backgroundColor: '#f3eaea',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingTop: 7,
    zIndex: 20,
    elevation: 6,
  },

  sidebarTopRow: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // paddingTop: 12,
    // paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },

  sidebarHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  directionBox: {
    paddingHorizontal: 12,
    // flex:1,
    paddingBottom: 7,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },

  directionText: {
    fontSize: 12,
    fontWeight: '700',
    // marginBottom: 8,
    color: '#334155',
  },

  routeSidebarContainer: {
    padding: 2,
  },
});
