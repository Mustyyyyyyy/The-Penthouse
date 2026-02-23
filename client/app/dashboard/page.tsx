"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { getUser, logout } from "@/lib/auth";
import { getRecent, getSaved, type ApartmentLite } from "@/lib/CustomerStore"; 

const WHATSAPP_PHONE = "2348109115088";
const SUPPORT_LINK = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  "Hello, I need help with apartment booking."
)}`;

export default function DashboardPage() {
  const router = useRouter();
  const user = useMemo(() => getUser(), []);

  const displayName =
    user?.fullName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "there");

  const [saved, setSaved] = useState<ApartmentLite[]>([]);
  const [recent, setRecent] = useState<ApartmentLite[]>([]);

  useEffect(() => {
    setSaved(getSaved());
    setRecent(getRecent());
  }, []);

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <RequireAuth>
      <main className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-950" />

        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl -z-10" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-400/15 blur-3xl -z-10" />

        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="star s1" />
          <div className="star s2" />
          <div className="star s3" />
          <div className="star s4" />
          <div className="star s5" />
          <div className="star s6" />
          <div className="star s7" />
          <div className="star s8" />

          <div className="line l1" />
          <div className="line l2" />
          <div className="line l3" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm">Customer Dashboard</p>

              {/* ✅ requested change */}
              <h1 className="text-4xl font-bold mt-2 text-white">
                Welcome, {displayName} 👋
              </h1>

              <p className="text-white/70 mt-2">
                Browse apartments and book instantly on WhatsApp.
              </p>
            </div>

            <button
              onClick={onLogout}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-white hover:bg-white/15 transition"
            >
              Logout
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <CardLink href="/apartments" label="Explore" title="Browse Apartments" sub="View listings" />

            <CardLink
              href="/dashboard/saved"
              label="Saved"
              title="My Favorites"
              sub={`${saved.length} saved`}
            />

            <a
              href={SUPPORT_LINK}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-white/15 bg-white/10 p-5 hover:bg-white/15 transition shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
              <p className="text-sm text-white/70">Support</p>
              <p className="text-lg font-semibold mt-1 text-white">Chat on WhatsApp</p>
              <p className="text-xs text-white/60 mt-2">Get help fast</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
                Open WhatsApp <span className="group-hover:translate-x-0.5 transition">→</span>
              </div>
            </a>

            <CardLink href="/" label="Home" title="Go to Landing" sub="See promotions" />
          </div>

          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recently viewed</h2>
              <Link href="/apartments" className="text-sm text-white/80 underline hover:text-white">
                Browse more
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-6 text-white/70">
                You haven’t viewed any apartment yet. Browse apartments to see them here.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                {recent.map((apt) => (
                  <Link
                    key={apt._id}
                    href={`/apartments/${apt._id}`}
                    className="group rounded-2xl overflow-hidden border border-white/15 bg-white/10 hover:bg-white/15 transition"
                  >
                    <img
                      src={apt.images?.[0] || "/placeholder.jpg"}
                      alt={apt.title}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <p className="font-semibold text-white group-hover:text-white/95">
                        {apt.title}
                      </p>
                      <p className="text-sm text-white/70">{apt.location}</p>
                      <p className="text-sm font-bold text-yellow-200 mt-2">
                        ₦{Number(apt.price).toLocaleString()} / Night
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <style jsx>{`
          .star {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.85);
            box-shadow: 0 0 18px rgba(255, 255, 255, 0.35);
            animation: twinkle 3.5s ease-in-out infinite;
          }

          .line {
            position: absolute;
            height: 1px;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.0),
              rgba(255, 255, 255, 0.35),
              rgba(255, 255, 255, 0.0)
            );
            opacity: 0.55;
          }

          .s1 { top: 12%; left: 10%; }
          .s2 { top: 20%; left: 28%; width: 4px; height: 4px; opacity: 0.8; }
          .s3 { top: 35%; left: 18%; width: 5px; height: 5px; opacity: 0.7; }
          .s4 { top: 28%; left: 46%; width: 3px; height: 3px; opacity: 0.65; }
          .s5 { top: 16%; left: 72%; width: 5px; height: 5px; opacity: 0.8; }
          .s6 { top: 40%; left: 82%; width: 4px; height: 4px; opacity: 0.7; }
          .s7 { top: 62%; left: 30%; width: 4px; height: 4px; opacity: 0.75; }
          .s8 { top: 68%; left: 64%; width: 3px; height: 3px; opacity: 0.6; }

          .l1 { top: 18%; left: 10%; width: 260px; transform: rotate(12deg); }
          .l2 { top: 30%; left: 18%; width: 340px; transform: rotate(-8deg); }
          .l3 { top: 64%; left: 30%; width: 380px; transform: rotate(6deg); }

          @keyframes twinkle {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.15); }
          }
        `}</style>
      </main>
    </RequireAuth>
  );
}

function CardLink({
  href,
  label,
  title,
  sub,
}: {
  href: string;
  label: string;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/15 bg-white/10 p-5 hover:bg-white/15 transition shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
    >
      <p className="text-sm text-white/70">{label}</p>
      <p className="text-lg font-semibold mt-1 text-white">{title}</p>
      <p className="text-xs text-white/60 mt-2">{sub}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
        Open <span className="group-hover:translate-x-0.5 transition">→</span>
      </div>
    </Link>
  );
}