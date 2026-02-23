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

const PLACEHOLDERS = [
  "/placeholder-1.jpg",
  "/placeholder-2.jpg",
  "/placeholder-3.jpg",
  "/placeholder-4.jpg",
  "/placeholder-5.jpg",
  "/placeholder-6.jpg",
];

function pickCardImage(apt: Apartment) {
  const first = apt.images?.[0];
  if (first && first.trim().length > 0) return first;

  const sum = (apt._id || "")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return PLACEHOLDERS[sum % PLACEHOLDERS.length] || "/placeholder.jpg";
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
    [apartments]
  );

  if (loading) {
    return (
      <div className="p-20 text-center text-gray-500">
        Loading apartments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="p-20 text-center text-gray-600">
        No apartments uploaded yet.
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold">Our Apartments in Ogbomoso</h1>
          <p className="text-gray-600 mt-2">
            {availableCount} available • {apartments.length} total
          </p>
        </div>

        <Link href="/dashboard" className="text-sm underline">
          Dashboard
        </Link>
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
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={img}
                className="w-full h-[250px] object-cover"
                alt={apt.title}
                loading="lazy"
              />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-lg font-bold">{apt.title}</h2>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      apt.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {apt.available ? "Available" : "Booked"}
                  </span>
                </div>

                <p className="text-gray-500 mb-2">{apt.location}</p>

                <p className="text-yellow-500 text-xl font-bold mb-4">
                  ₦{Number(apt.price).toLocaleString()} / Night
                </p>

                <p className="text-sm text-gray-600 mb-6">
                  {apt.rooms} Rooms
                </p>

                <div className="mt-auto flex flex-col gap-3">
                  <Link
                    href={`/apartments/${apt._id}`}
                    className="mt-auto bg-black text-white text-center py-2 rounded hover:bg-gray-800"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => {
                      const nowSaved = toggleSaved(aptLite);
                      setSavedMap((prev) => ({ ...prev, [apt._id]: nowSaved }));
                    }}
                    className={`border py-2 rounded font-semibold transition ${
                      savedMap[apt._id]
                        ? "bg-black text-white border-black"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {savedMap[apt._id] ? "Saved " : "Save"}
                  </button>

                  <a
                    href={waLink(message)}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-green-600 text-green-700 text-center py-2 rounded hover:bg-green-50 font-semibold"
                  >
                    Book on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}