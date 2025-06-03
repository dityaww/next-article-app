"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/stores/authStore";

type Options = {
  role?: "Admin" | "User" | null;
  redirectTo?: string; 
};

export function useProtectedPage(options?: Options) {
  const { token, role } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (!token) {
      router.replace("/login");
      return;
    }

    if (options?.role && role !== options.role) {
      router.replace(options.redirectTo || "/unauthorized");
    }
  }, [token, role, options?.role, options?.redirectTo, router]);

  return { token, role };
}