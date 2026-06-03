//Inspiré de code d'un projet de Programmation Web Avancée

import React, { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {

  apiAddress: string;
  setApiAddress: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [apiAddress, setApiAddress] = useState<string>(
    process.env.REACT_APP_API_URL as string
  );

  const contextValue = {
    apiAddress,
    setApiAddress,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};