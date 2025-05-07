"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";
import { useRedirectIfAuthenticated } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  // Chuyển hướng nếu người dùng đã đăng nhập
  useRedirectIfAuthenticated("/hero");

  // Đảm bảo hiển thị UI chỉ khi đã ở client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Hoặc hiển thị loading spinner
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-[380px]">
        <div
          className="absolute -top-10 -left-20 w-40 h-40 bg-blue-400 opacity-10 rounded-lg"
          style={{ zIndex: 1 }}
        ></div>
        <div
          className="absolute -bottom-10 -right-20 w-40 h-40 bg-blue-400 opacity-10 rounded-lg"
          style={{ zIndex: 1 }}
        ></div>
        <Card
          className="w-full shadow-lg"
          style={{ zIndex: 2, position: "relative" }}
        >
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              <Link href={"/"}>
                <Image
                  src={"/images/holyG-logo.png"}
                  width={150}
                  height={60}
                  alt="Login Logo"
                  className="mx-auto"
                  unoptimized
                />
              </Link>
              <h2 className="text-red-600 font-bold text-2xl uppercase">
                Đăng nhập
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
