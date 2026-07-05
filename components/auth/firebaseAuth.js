import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

import { auth } from '../../firebase/firebase';

import axios from 'axios';
import {
  getDeviceId,
  getFcmToken,
  getLocation,
  getPlatform,
} from './deviceUtils';

// ✅ LOGIN
export const firebase_login = async (email, password) => {
  if (!auth.currentUser)
    return {
      success: true,
      token: 'locahtjldajflkjdarueoiueiqpqurqoiruqoierjklfajfakdj',
    };
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);

    const token = await user.user.getIdToken();

    return {
      success: true,
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Login failed',
    };
  }
};

// ✅ REGISTER
export const firebase_register = async (email, password) => {
  if (!auth.currentUser)
    return {
      success: true,
      token: 'locahtjldajflkjdarueoiueiqpqurqoiruqoierjklfajfakdj',
    };
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);

    const token = await user.user.getIdToken();

    return {
      success: true,
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Signup failed',
    };
  }
};

// ✅ LOGOUT
export const firebase_logout = async (BackendHost) => {
  if (!auth.currentUser)
    return {
      success: true,
      token: 'locahtjldajflkjdarueoiueiqpqurqoiruqoierjklfajfakdj',
    };
  await signOut(auth);

  await axios.post(`${BackendHost}/logout`);
};
