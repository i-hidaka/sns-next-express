import apiClient from "@/lib/apiClient";
import React, { ReactNode, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  username: string;
}
interface AuthContextType {
  user: null | User;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

      apiClient
        .get("/users/find")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    try {
      apiClient.get("/users/find").then((res) => {
        setUser(res.data.user);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
  };

  const value = { login, logout, user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
