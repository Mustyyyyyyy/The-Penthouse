export type Role = "admin" | "staff" | "user";

export type AuthUser = {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email: string;
  role?: Role;
};

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}