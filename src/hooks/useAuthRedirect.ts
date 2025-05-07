import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu môi trường là client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);
};

export default useAuthRedirect;
