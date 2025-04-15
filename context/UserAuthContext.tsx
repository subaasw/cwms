"use client";

import { redirect } from "next/navigation";
import { USER_URL } from "@/utils/apiConstant";
import { setLocalStorage } from "@/utils/localStorage";
import serverCall from "@/utils/serverCall";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  community?: string;
  profilePicture?: string;
}

interface AuthContextType {
  userData: User | null;
  setUserData: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const response: any = await serverCall.get(USER_URL.USER.me);

      if (response?.user) {
        setLocalStorage("user", response.user);
        setUserData(response.user);
      } else {
        return redirect("/login");
      }
    };

    getCurrentUser();
  }, []);

  const login = (user: User) => {
    setUserData(user);
  };

  const logout = () => {
    setUserData(null);
  };

  const value: AuthContextType = {
    userData,
    setUserData,
    login,
    logout,
  };

  if (!userData) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
