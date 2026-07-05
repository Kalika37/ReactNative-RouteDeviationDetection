import React, {
  createContext,
  useContext, useState
} from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {

  const BACKEND_HOST= "https://6c5a-103-163-182-31.ngrok-free.app"

  const [currentDevice,setCurrentDevice]=useState({})
  
  return (
    <ConfigContext.Provider value={{
      BACKEND_HOST,
      currentDevice,
      setCurrentDevice
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () =>
  useContext(ConfigContext);