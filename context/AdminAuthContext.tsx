"use client";

import { redirect } from "next/navigation";
import { setLocalStorage } from "@/utils/localStorage";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { adminAuthService } from "@/utils/adminAuth";

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

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const response: any = await adminAuthService.getProfile();

      if (response?.admin) {
        setLocalStorage("user", response.admin);
        setUserData(response.admin);
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

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = (): AuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
