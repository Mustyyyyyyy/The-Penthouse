"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signup({ fullName, phone, email, password });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden text-white">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1950&q=80')",
        }}
      />

      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <Link href="/" className="text-sm text-white/80 hover:text-white">
          ← Back to Home
        </Link>

        <div className="mt-10 grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <p className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/20">
              Penthouse Apartments
            </p>

            <h1 className="text-5xl font-bold mt-4 leading-tight">
              Find comfort.
              <span className="block text-white/70">
                Book with confidence.
              </span>
            </h1>

            <p className="text-white/70 mt-6 max-w-md text-lg">
              Explore verified apartments, view real photos, and book instantly
              through WhatsApp in seconds.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold">Create account</h2>

            <p className="text-white/70 mt-1">
              Already have an account?{" "}
              <Link href="/login" className="text-white underline font-semibold">
                Login
              </Link>
            </p>

            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="mt-6 space-y-4">

              <Input
                label="Full name"
                value={fullName}
                setValue={setFullName}
                placeholder="Alagbe Mustapha"
              />

              <Input
                label="Phone (optional)"
                value={phone}
                setValue={setPhone}
                placeholder="0810..."
              />

              <Input
                label="Email"
                type="email"
                value={email}
                setValue={setEmail}
                placeholder="you@email.com"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                setValue={setPassword}
                placeholder="Create a strong password"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="text-xs text-white/60 text-center">
                By creating an account, you agree to our terms and privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
  placeholder,
  type = "text",
}: any) {
  return (
    <div>
      <label className="text-sm text-white/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40"
        required={label !== "Phone (optional)"}
      />
    </div>
  );
}