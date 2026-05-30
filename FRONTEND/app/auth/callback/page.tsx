"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initializeAuth, isInitialized } = useAuthStore();
  const authSuccess = searchParams.get("auth") === "success";
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        // Handle error from backend
        router.push(`/auth/login?error=${error}`);
        return;
      }

      if (authSuccess && token) {
        // Save token to localStorage immediately
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }

        // Reinitialize auth to fetch user from backend with the token
        await initializeAuth();

        // Redirect to dashboard
        router.push("/dashboard");
      }
    };

    handleCallback();
  }, [authSuccess, token, error, router, initializeAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}
