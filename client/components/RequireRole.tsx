"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type Role = "admin" | "staff" | "customer";

type User = {
  role?: Role;
  fullName?: string;
  email?: string;
};

function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function RequireRole({
  allowed,
  children,
  redirectTo = "/login",
}: {
  allowed: Role[];
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace(redirectTo);
      return;
    }

    const role = user.role;

    if (!role || !allowed.includes(role)) {
      router.replace("/unauthorized");
      return;
    }

    setOk(true);
  }, [allowed, redirectTo, router]);

  if (!ok) return null;
  return <>{children}</>;
}