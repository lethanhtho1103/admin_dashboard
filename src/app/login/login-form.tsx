/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as z from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(8, { message: "Mật khẩu tối thiểu 8 ký tự" }),
});

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/login", data);
      const { token, user } = res.data;

      // Sử dụng AuthContext để lưu token và thông tin đăng nhập
      login(token, user);

      toast.success("Đăng nhập thành công!");
      router.push("/dashboard"); // Đảm bảo chuyển hướng đến trang chính sau khi đăng nhập
    } catch (error: any) {
      let message = "Đăng nhập thất bại. Vui lòng thử lại.";
      if (axios.isAxiosError(error)) {
        console.log(error);
        const errorMsg = error.response?.data?.message || error.message;
        if (errorMsg.toLowerCase().includes("email")) {
          message = "Email không tồn tại.";
        } else if (errorMsg.toLowerCase().includes("password")) {
          message = "Mật khẩu không đúng.";
        } else {
          message = errorMsg;
        }
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register("email")}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            className="pl-10 pr-10"
            {...register("password")}
            disabled={isLoading}
          />
          <div
            className="absolute right-3 top-2.5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="py-6">
        <Button
          type="submit"
          variant={"destructive"}
          className="mt-1 w-full cursor-pointer hover:opacity-90 text-xl uppercase"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </div>
    </form>
  );
}
