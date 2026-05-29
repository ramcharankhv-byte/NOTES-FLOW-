"use client";

import { useAuthStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If the user is fully authenticated, don't let them see auth pages
    // Exception: complete-signup might be a special case but usually the user 
    // shouldn't have an active session yet while on that page.
    if (isInitialized && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isInitialized, router]);

  return <>{children}</>;
}
