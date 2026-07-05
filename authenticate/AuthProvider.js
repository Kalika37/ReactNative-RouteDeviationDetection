import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

import {useConfig} from '../config'

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminAccess, setAdminAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {BACKEND_HOST}= useConfig()
  const verifyUser = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        `${BACKEND_HOST}/auth`,
      );
      setAdminAccess(
        res.data.adminAccess
      );
      setAuthenticated(
        res.data.authenticated
      );
      
      setLoading(false);
    } catch (err) {
      setAuthenticated(false);
      if (!err.response) {
        setError(
          "Unable to connect to the server."
        );
      } else {
        setError(
          `Server Error ${err.response.status}`
        );
      }
    } 
  };

  useEffect(() => {
    verifyUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated, 
        adminAccess,
        setAdminAccess,
        loading,
        error,
        verifyUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
