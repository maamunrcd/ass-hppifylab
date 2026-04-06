"use client";

import { useTransition } from "react";
import { logoutAction } from "@/features/auth/auth.actions";

export function useAuth() {
  const [logoutPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(() => {
      void logoutAction();
    });
  };

  return { logout, logoutPending };
}
