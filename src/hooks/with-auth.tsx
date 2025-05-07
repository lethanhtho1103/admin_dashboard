"use client";

import { useRequireAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

// HOC để bảo vệ các trang yêu cầu đăng nhập
export default function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectUrl = "/login"
) {
  return function ProtectedRoute(props: P) {
    const [mounted, setMounted] = useState(false);
    const { isLoading, isAuthenticated } = useRequireAuth(redirectUrl);

    useEffect(() => {
      setMounted(true);
    }, []);

    // Nếu chưa ở client hoặc đang kiểm tra xác thực, hiển thị loading
    if (!mounted || isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // Nếu đã kiểm tra xong và chưa đăng nhập, chuyển hướng
    if (!isAuthenticated) {
      return null; // Hook useRequireAuth sẽ tự động chuyển hướng
    }

    // Người dùng đã đăng nhập, hiển thị component được bảo vệ
    return <Component {...props} />;
  };
}
