import apiClient from "@/lib/apiClient";
import React, { ReactNode, useContext, useEffect } from "react";

interface AuthContextType {
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
  }, []);

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
  };

  const value = { login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
