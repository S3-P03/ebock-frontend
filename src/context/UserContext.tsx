import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  }

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const payload: any = jwtDecode(token);
          const expiration = payload.exp * 1000;

          if (expiration > Date.now()) {
            setIsLoggedIn(true);
            setUser(payload);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        } finally {
            setIsLoading(false);
        }
      } else {
        logout();
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    isLoading,
    setIsLoading,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};