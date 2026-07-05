import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
axios.defaults.withCredentials = true;

import ConfirmDialog from '../windows/Confirm';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/* =========================
   Helpers
========================= */

import * as Clipboard from 'expo-clipboard';

const copyToClipboard = async (text) => {
  await Clipboard.setStringAsync(text);
};

function formatDuration(minutes) {
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = days / 30;
  const years = days / 365;

  if (minutes < 60) return `${Math.round(minutes)} min`;
  if (hours < 24) return `${hours.toFixed(1)} hr`;
  if (days < 7) return `${days.toFixed(1)} days`;
  if (days < 30) return `${weeks.toFixed(1)} weeks`;
  if (days < 365) return `${months.toFixed(1)} months`;
  return `${years.toFixed(1)} years`;
}

function getClosestIndex(route, current) {
  let minDist = Infinity;
  let index = 0;

  route.forEach((p, i) => {
    const d =
      Math.pow(p.latitude - current.latitude, 2) +
      Math.pow(p.longitude - current.longitude, 2);

    if (d < minDist) {
      minDist = d;
      index = i;
    }
  });

  return index;
}

/* =========================
   Smart placement logic
========================= */

const MENU_WIDTH = 220;
const MENU_HEIGHT = 180;
const PADDING = 12;

function computePlacement(x, y, mapWidth, mapHeight) {
  const right = mapWidth - x;
  const bottom = mapHeight - y;

  if (right < MENU_WIDTH && bottom < MENU_HEIGHT) return 'top-left';
  if (right < MENU_WIDTH) return 'bottom-left';
  if (bottom < MENU_HEIGHT) return 'top-right';
  return 'bottom-right';
}

/* =========================
   Context Menu (Google style)
========================= */

function ContextMenu({
  x,
  y,
  placement,
  items,
  latitude,
  longitude,
  onClose,
  mapWidth,
  mapHeight,
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
  }, []);

  const opacity = anim;
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  let left = x;
  let top = y;

  // if (placement.includes('left')) left = x - MENU_WIDTH;
  // if (placement.includes('top')) top = y - MENU_HEIGHT;

  left = Math.max(PADDING, Math.min(left, mapWidth - MENU_WIDTH - PADDING));
  top = Math.max(PADDING, Math.min(top, mapHeight - MENU_HEIGHT - PADDING));

  return (
    <>
      {/* backdrop */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        style={[
          styles.contextMenu,
          {
            left,
            top,
            opacity,
            transform: [{ scale }],
          },
        ]}>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {item.divider ? (
              <View style={styles.contextDivider} />
            ) : (
              <Pressable
                onPress={() => item.onClick(item)}
                style={({ pressed }) => [
                  styles.contextItem,
                  pressed && styles.contextItemPressed,
                ]}>
                <Text style={styles.contextItemText}>{item.text}</Text>
              </Pressable>
            )}
          </React.Fragment>
        ))}
      </Animated.View>
    </>
  );
}

/* =========================
   Main Component
========================= */

import douglasPeucker from './RouteSimplifier/route-simplification';
import { useConfig } from '../config';

export default function RoutePickker() {
  const { BACKEND_HOST } = useConfig();
  const mapRef = useRef(null);
  const [routes, setRoutes] = useState([]);
  const [routeInfo, setRouteInfo] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [selectingRoute, setSelectingRoute] = useState(0);

  const [loading, setLoading] = useState(false); // ✅ ADD THIS

  const [uploadAfterLoad, setUploadAfterLoad] = useState(false);
  const [routeSelected, setRouteSelected] = useState(true);

  const [homeToSchool, setHomeToSchool] = useState(true);

  const [homeLocation, setHomeLocation] = useState({
    latitude: 27.694583,
    longitude: 85.381716,
  });

  const [schoolLocation, setSchoolLocation] = useState({
    latitude: 27.661139,
    longitude: 85.373988,
  });

  const [currentPos] = useState({
    latitude: 27.6752,
    longitude: 85.3521,
  });

  const [menu, setMenu] = useState({
    visible: false,
    latitude: null,
    longitude: null,
    x: 0,
    y: 0,
    placement: 'bottom-right',
  });
  const [menuInfo, setMenuInfo] = useState({
    visible: false,
    route: null,
    x: 0,
    y: 0,
    placement: 'bottom-right',
  });

  const WALK_SPEED = 4.2;
  const STOP_RATIO = 0.25;

  /* =========================
     Load routes
  ========================= */

  useEffect(() => {
    loadRoutes();
  }, [homeLocation, schoolLocation]);

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
      setRoutes(all);
      setRouteInfo(
        fetched.map((route, index) => ({
          id: index,
          distance: (route.distance / 1000).toFixed(2),
          duration: formatDuration(
            ((route.distance / 1000 / WALK_SPEED) * 60) / (1 - STOP_RATIO)
          ),
          start,
          end,
        }))
      );
      setSelectedRoute(0);
      if (uploadAfterLoad) {
        sendMapToBackend(0);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Context menu handler (FIXED)
  ========================= */
  let openTime = Date.now();
  let sendedToBackendTime = Date.now();
  const sendMapToBackend = async (index) => {
    if (index === selectedRoute && routeSelected) {
      Alert.alert(
        '⚠️ Already Selected',
        'Same route cannot be uploaded multiple times',
        [{ text: 'OK' }],
        {
          cancelable: false,
        }
      );
      return;
    }
    if (Date.now() - sendedToBackendTime < 5000) {
      Alert.alert(
        '⚠️ Wait',
        'You should wait 10 seconds to change route after one selected',
        [{ text: 'OK' }],
        {
          cancelable: false,
        }
      );
      return;
    }
    const route = routes[index];
    const rout = [];
    route.forEach((r) => {
      rout.push({
        lat: r.latitude,
        lon: r.longitude,
      });
    });

    const simplified = douglasPeucker(rout, 0.000045);

    try {
      const response = await axios.post(
        `${BACKEND_HOST}/api/route/getCurrentRoute`,
        {
          routes: simplified,
          index: index,
        }
      );
      if (response.data) {
        setRouteSelected(true);
        setSelectedRoute(index);
        Alert.alert(
          '🟢 Success',
          'Route Successfully Updated !!!',
          [{ text: 'OK' }],
          {
            cancelable: false,
          }
        );
      }
    } catch (e) {
      Alert.alert('🔴 Something went wrong', e.message, [{ text: 'OK' }], {
        cancelable: false,
      });
      return;
    }
    sendedToBackendTime = Date.now();
  };

  const handleMapLongPress = async (e) => {
    const coordinate = e.nativeEvent.coordinate;

    if (!mapRef.current) return;

    const point = await mapRef.current.pointForCoordinate(coordinate);
    openTime = Date.now();
    const mapWidth = SCREEN_WIDTH;
    const mapHeight = SCREEN_HEIGHT;

    const placement = computePlacement(point.x, point.y, mapWidth, mapHeight);

    setMenu({
      visible: true,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      x: point.x,
      y: point.y,
      placement,
    });
  };
  const closeMenu = () => setMenu((m) => ({ ...m, visible: false }));
  const [dialogVisible, setDialogVisible] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [changeHome, setChangeHome] = useState(false);
  const menuItems = [
    {
      text: `${menu?.latitude?.toFixed(6)},${menu?.longitude?.toFixed(6)}`,
      onClick: () => {
        copyToClipboard(`${menu?.latitude},${menu?.longitude}`);
        closeMenu();
      },
    },
    {
      text: 'Set as Home',
      onClick: () => {
        setChangeHome(true);
        setDialogVisible(true);

        closeMenu();
      },
    },
    {
      text: 'Set as Destination',
      onClick: () => {
        setChangeHome(false);
        setDialogVisible(true);
        closeMenu();
      },
    },
    {
      text: 'Switch Direction',
      onClick: () => {
        setHomeToSchool((p) => !p);
        closeMenu();
      },
    },
  ];
  const closeMenuInfo = () => setMenuInfo((m) => ({ ...m, visible: false }));

  const selectedRouteCoords = routes[selectedRoute] || [];

  const progressRoute = useMemo(() => {
    if (!selectedRouteCoords.length) return [];
    const idx = getClosestIndex(selectedRouteCoords, currentPos);
    return selectedRouteCoords.slice(0, idx + 1);
  }, [selectedRouteCoords]);
  useEffect(() => {
    if (selectedRouteCoords.length > 0) {
      mapRef.current?.fitToCoordinates(selectedRouteCoords, {
        edgePadding: {
          top: 80,
          right: 50,
          bottom: 80,
          left: 50,
        },
        animated: true,
      });
    }
  }, [selectedRouteCoords]);

  const currentStart = homeToSchool ? homeLocation : schoolLocation;
  const currentEnd = homeToSchool ? schoolLocation : homeLocation;
  const CloseAllMenus = () => {
    if (Date.now() - openTime > 500) {
      closeMenu();
      closeMenuInfo();
    }
  };
  const showLonglat = true;
  const showHomeAndDest = true;
  const getHomeStr = (item) => {
    if (showLonglat) {
      return `${item.start.longitude.toFixed(4)},${item.start.latitude.toFixed(
        4
      )}`;
    }
    return homeToSchool ? 'Home' : 'School';
  };
  const getDestStr = (item) => {
    if (showLonglat) {
      return `${item.end.longitude.toFixed(4)},${item.end.latitude.toFixed(4)}`;
    }
    return homeToSchool ? 'School' : 'Home';
  };
  /* =========================
     UI
  ========================= */

  return (
    <Pressable style={styles.container} onPress={CloseAllMenus}>
      <View style={styles.container}>
        {/* Sidebar */}
        {/* SIDEBAR */}

        {/* Map */}
        <View style={styles.mapWrapper}>
          <MapView
            key={`map-${selectedRoute}`} // 🔥 FORCE RE-RENDER FIX
            ref={mapRef}
            style={styles.map}
            onLongPress={handleMapLongPress}
            initialRegion={{
              latitude: currentStart.latitude,
              longitude: currentStart.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}>
            {routes.map((route, index) => {
              const isSelected = index === selectedRoute;

              return (
                <Polyline
                  key={index}
                  coordinates={route}
                  onPress={() => {
                    setSelectedRoute(index);

                    if (mapRef.current && route.length) {
                      mapRef.current.fitToCoordinates(route, {
                        edgePadding: {
                          top: 80,
                          right: 80,
                          bottom: 80,
                          left: 80,
                        },
                        animated: true,
                      });
                    }
                  }}
                  strokeColor={isSelected ? '#2563eb' : 'rgba(0,0,0,0.75)'}
                  strokeWidth={isSelected ? 7 : 3}
                  lineDashPattern={isSelected ? undefined : [6, 8]}
                  zIndex={isSelected ? 999 : 1}
                  lineCap="round"
                  lineJoin="round"
                />
              );
            })}

            <Marker coordinate={currentStart} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.startDotOuter}>
                <View style={styles.startDotInner} />
              </View>
            </Marker>
            <Marker coordinate={currentEnd} />
          </MapView>
          {menu.visible && (
            <ContextMenu
              x={menu.x}
              y={menu.y}
              placement={menu.placement}
              items={menuItems}
              latitude={menu.latitude}
              longitude={menu.longitude}
              onClose={closeMenu}
              mapWidth={SCREEN_WIDTH}
              mapHeight={SCREEN_HEIGHT}
            />
          )}
        </View>
        <View style={[styles.routeSidebar, { width: SCREEN_WIDTH }]}>
          {/* TOP BAR */}

          <View style={styles.sidebarTopRow}>
            <Text style={styles.sidebarHeader}>Available Routes</Text>
          </View>

          {/* FULL SIDEBAR */}
          {/* Direction box */}
          <View style={styles.directionBox}>
            <Text style={styles.directionText}>
              {homeToSchool ? 'Home → School' : 'School → Home'}
            </Text>
            <Pressable
              onPress={() => setHomeToSchool((p) => !p)}
              style={styles.switchButton}>
              <Text style={styles.switchButtonText}>⇄</Text>
            </Pressable>
          </View>

          <View style={styles.routeSidebarContainer}>
            {loading && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Loading routes...</Text>
              </View>
            )}

            {!loading && routeInfo.length === 0 && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>No routes found</Text>
              </View>
            )}
            <ScrollView
              contentContainerStyle={styles.sidebarContent}
              horizontal
              showsHorizontalScrollIndicator={false}>
              <View style={styles.routeInfos}>
                {routeInfo.map((route, index) => (
                  <Pressable
                    key={index}
                    onPress={(e) => {
                      sendMapToBackend(index);

                      // ConfirmationMenuPressed(e, route);
                    }}
                    // onPress={(e) => {
                    //   setSelectedRoute(index);
                    //   if (mapRef.current && routes[index]?.length) {
                    //     mapRef.current.fitToCoordinates(routes[index], {
                    //       edgePadding: {
                    //         top: 80,
                    //         right: 80,
                    //         bottom: 80,
                    //         left: 80,
                    //       },
                    //       animated: true,
                    //     });
                    //   }
                    // }}
                    style={({ pressed }) => [
                      styles.routeCard,
                      selectedRoute === index && styles.selectedRouteCard,
                      pressed && styles.routeCardPressed,
                    ]}>
                    <Text style={styles.routeTitle}>Route {index + 1}</Text>
                    <Text style={styles.routeDetail}>
                      📏 Distance: {route.distance} km
                    </Text>
                    <Text style={styles.routeDetail}>
                      🚶 Duration: {route.duration}
                    </Text>
                    {showHomeAndDest ? (
                      <>
                        <Text style={styles.routeDetail}>
                          {' '}
                          🏠 Start: {getHomeStr(route)}{' '}
                        </Text>{' '}
                        <Text style={styles.routeDetail}>
                          {' '}
                          🎯 End: {getDestStr(route)}{' '}
                        </Text>
                      </>
                    ) : (
                      ''
                    )}
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      <ConfirmDialog
        visible={dialogVisible}
        title="Send Route"
        message="Send this selected route to the backend?"
        remember={rememberChoice}
        setRemember={setRememberChoice}
        onCancel={() => {
          setDialogVisible(false);
          setUploadAfterLoad(false);
          setRouteSelected(false);
          if (changeHome) {
            setHomeLocation({
              latitude: menu.latitude,
              longitude: menu.longitude,
            });
          } else {
            if (changeHome) {
              setSchoolLocation({
                latitude: menu.latitude,
                longitude: menu.longitude,
              });
            }
          }
        }}
        onConfirm={() => {
          setDialogVisible(false);
          setRouteSelected(false);
          setUploadAfterLoad(true);
          if (changeHome) {
            setHomeLocation({
              latitude: menu.latitude,
              longitude: menu.longitude,
            });
          } else {
            if (changeHome) {
              setSchoolLocation({
                latitude: menu.latitude,
                longitude: menu.longitude,
              });
            }
          }
        }}
      />
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
    height: 200,
    backgroundColor: '#f3eaea',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingTop: 7,
    zIndex: 20,
    elevation: 6,
  },

  sidebarTopRow: {
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

  switchButton: {
    backgroundColor: '#0081f1d1',
    borderRadius: 4,
    alignItems: 'center',
    width: 40,
    paddingBottom: 3,
  },

  switchButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  routeSidebarContainer: {
    padding: 2,
  },

  sidebarContent: {
    padding: 2,
    // flex: 1,
    // height:100
  },
  routeInfos: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: '#475569',
  },

  routeCard: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#fff',
  },

  routeCardPressed: {
    opacity: 0.9,
  },

  selectedRouteCard: {
    borderColor: '#2563eb',
  },

  routeTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },

  routeDetail: {
    fontSize: 13,
    marginBottom: 6,
    color: '#475569',
  },

  /* =========================
     COLLAPSED SIDEBAR
  ========================= */

  /* =========================
     CONTEXT MENU (GOOGLE STYLE)
  ========================= */

  contextMenu: {
    position: 'absolute',
    width: 220,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 99,
  },

  contextItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  contextItemPressed: {
    backgroundColor: '#f1f5f9',
  },

  contextItemText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },

  contextDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 6,
  },

  latLngText: {
    fontSize: 11,
    color: '#64748b',
    paddingHorizontal: 12,
  },
});
