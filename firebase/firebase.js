import { initializeApp } from "firebase/app";

import {
  initializeAuth,
  // getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyB-0U5MLDgeJmlc3Ulp0JX1wseOMAehztY",
    authDomain: "sosdevice-29238.firebaseapp.com",
    projectId: "sosdevice-29238",
    storageBucket: "sosdevice-29238.firebasestorage.app",
    messagingSenderId: "304291542366",
    appId: "1:304291542366:web:c36e7205ff7c5d66180bcf",
    measurementId: "G-M9FJCJBTXW"
};

const app = initializeApp(firebaseConfig);

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
 export const auth = {}