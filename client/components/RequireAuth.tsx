"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function RequireAuth({
  children,
  redirectTo = "/login",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(redirectTo);
      return;
    }
    setOk(true);
  }, [router, redirectTo]);

  if (!ok) return null;
  return <>{children}</>;
}