"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAllApartments } from "@/lib/api";
import { isSaved, toggleSaved, type ApartmentLite } from "@/lib/CustomerStore";

type Apartment = {
  _id: string;
  title: string;
  location: string;
  price: number;
  rooms: number;
  images: string[];
  available: boolean;
  description?: string;
};

const WHATSAPP_PHONE = "2348109115088";
function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

const FALLBACKS = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
];

function pickCardImage(apt: Apartment) {
  const first = apt.images?.[0];
  if (first && first.trim()) return first;

  const sum = (apt._id || "")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return FALLBACKS[sum % FALLBACKS.length];
}

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadApartments() {
      try {
        setError("");
        const data: Apartment[] = await getAllApartments();
        if (!mounted) return;

        setApartments(data);

        const map: Record<string, boolean> = {};
        data.forEach((apt) => (map[apt._id] = isSaved(apt._id)));
        setSavedMap(map);
      } catch (err: any) {
        console.error("Failed to fetch apartments:", err);
        if (mounted) setError(err?.message || "Failed to load apartments.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadApartments();
    return () => {
      mounted = false;
    };
  }, []);

  const availableCount = useMemo(
    () => apartments.filter((a) => a.available !== false).length,
    [apartments],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading apartments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border rounded-2xl p-6 text-center">
          <p className="text-red-600 font-semibold mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No apartments uploaded yet.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Our Apartments in Ogbomoso</h1>
            <p className="text-gray-600 mt-2">
              {availableCount} available • {apartments.length} total
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard" className="text-sm underline">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apartments.map((apt) => {
            const img = pickCardImage(apt);

            const aptLite: ApartmentLite = {
              _id: apt._id,
              title: apt.title,
              location: apt.location,
              price: apt.price,
              rooms: apt.rooms,
              images: apt.images,
              available: apt.available,
            };

            const message = [
              "Hello, I want to book an apartment.",
              "",
              `Apartment: ${apt.title}`,
              `Location: ${apt.location}`,
              `Price/Night: ₦${Number(apt.price).toLocaleString()}`,
              `Rooms: ${apt.rooms}`,
              `Availability: ${apt.available ? "Available" : "Booked"}`,
              `Apartment ID: ${apt._id}`,
            ].join("\n");

            return (
              <div
                key={apt._id}
                className="group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition flex flex-col"
              >
                <div className="relative">
                  <img
                    src={img}
                    className="w-full h-[260px] object-cover group-hover:scale-[1.02] transition duration-300"
                    alt={apt.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />

                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        apt.available
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {apt.available ? "Available" : "Booked"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const nowSaved = toggleSaved(aptLite);
                      setSavedMap((prev) => ({ ...prev, [apt._id]: nowSaved }));
                    }}
                    className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur border transition ${
                      savedMap[apt._id]
                        ? "bg-black/80 text-white border-black/60"
                        : "bg-white/70 text-black border-white/60 hover:bg-white/90"
                    }`}
                  >
                    {savedMap[apt._id] ? "Saved ✓" : "Save"}
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-semibold text-lg leading-tight">
                      {apt.title}
                    </p>
                    <p className="text-sm text-white/85">{apt.location}</p>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-yellow-600 text-xl font-bold">
                    ₦{Number(apt.price).toLocaleString()}{" "}
                    <span className="text-sm text-gray-500">/ Night</span>
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {apt.rooms} Rooms
                  </p>

                  <div className="mt-auto flex flex-col gap-3 pt-6">
                    <Link
                      href={`/apartments/${apt._id}`}
                      className="bg-black text-white text-center py-2.5 rounded-lg hover:bg-gray-900"
                    >
                      View Details
                    </Link>

                    {apt.available ? (
                      <a
                        href={waLink(message)}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-green-600 text-green-700 text-center py-2 rounded hover:bg-green-50 font-semibold"
                      >
                        Book on WhatsApp
                      </a>
                    ) : (
                      <button
                        disabled
                        className="border border-gray-300 text-gray-400 text-center py-2 rounded font-semibold cursor-not-allowed"
                      >
                        Booked — Not Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-10">
          Tip: Add 3–6 unique images per apartment in Admin to make listings
          look premium.
        </p>
      </div>
    </main>
  );
}
