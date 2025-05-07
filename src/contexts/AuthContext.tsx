/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";

type User = {
  id: string;
  email: string;
  name?: string;
  // Thêm các trường khác tùy theo API của bạn
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Khởi tạo trạng thái xác thực từ localStorage khi component mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Kiểm tra xác thực từ token trong localStorage
  const checkAuth = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        return false;
      }

      // Thiết lập token cho các API request
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      // Tùy chọn: Xác thực token với server
      // const res = await api.get("/api/auth/me");
      // const userData = res.data.user;

      // Hoặc lấy thông tin user từ localStorage nếu đã lưu
      const userData = JSON.parse(localStorage.getItem("user") || "null");

      setToken(storedToken);
      setUser(userData);

      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Xóa token không hợp lệ
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      return false;
    }
  };

  const login = (newToken: string, userData?: any) => {
    localStorage.setItem("token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }

    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook để bảo vệ các trang yêu cầu đăng nhập
export const useRequireAuth = (redirectUrl = "/login") => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== redirectUrl) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl, pathname]);

  return { isLoading, isAuthenticated };
};

// Hook để chuyển hướng người dùng đã đăng nhập từ các trang như login, register
export const useRedirectIfAuthenticated = (redirectUrl = "/hero") => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl]);

  return { isLoading, isAuthenticated };
};
