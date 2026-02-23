"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";


type Role = "admin" | "staff" | "customer";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await api.post("/auth/login", { email, password });

    const { token, user } = res.data;

    if (!token || !user) throw new Error("Invalid login response.");

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role !== "admin" && user.role !== "staff") {
      throw new Error("You are not authorized as admin.");
    }

    router.push("/admin/dashboard");
  } catch (err: any) {
    setError(err?.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Admin</p>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-600 mt-1">
            Manage apartments, availability and bookings.
          </p>
        </div>

        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="admin@email.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 flex justify-between">
          <Link href="/" className="underline">
            Back to site
          </Link>
          <Link href="/login" className="underline">
            Customer login
          </Link>
        </div>
      </div>
    </main>
  );
}