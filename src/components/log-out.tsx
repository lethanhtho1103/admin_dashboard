"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function Logout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công.");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-start text-sm text-gray-500 hover:text-gray-700 ml-2 mb-2 cursor-pointer"
    >
      <LogOut className="mr-2" />
      Đăng xuất
    </button>
  );
}
