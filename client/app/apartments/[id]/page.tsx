"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApartment } from "@/lib/api";
import {
  pushRecent,
  toggleSaved,
  isSaved,
  type ApartmentLite,
} from "@/lib/CustomerStore";

type Apartment = {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  rooms: number;
  images: string[];
  available: boolean;
};

const WHATSAPP_PHONE = "2348109115088";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export default function ApartmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [apt, setApt] = useState<Apartment | null>(null);
  const [activeImg, setActiveImg] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data: Apartment = await getApartment(id);
        if (!mounted) return;

        setApt(data);
        setSaved(isSaved(data._id));
        setActiveImg(data.images?.[0] || "/placeholder.jpg");

        const lite: ApartmentLite = {
          _id: data._id,
          title: data.title,
          location: data.location,
          price: data.price,
          rooms: data.rooms,
          images: data.images,
          available: data.available,
        };

        pushRecent(lite);
      } catch (e) {
        console.error("Failed to load apartment:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const whatsappMessage = useMemo(() => {
    if (!apt) return "";

    return [
      "Hello, I want to book an apartment.",
      "",
      `Apartment: ${apt.title}`,
      `Location/Address: ${apt.location}`,
      `Price/Night: ₦${Number(apt.price).toLocaleString()}`,
      `Rooms: ${apt.rooms}`,
      `Availability: ${apt.available ? "Available" : "Booked"}`,
      "",
      checkIn ? `Check-in: ${checkIn}` : null,
      checkOut ? `Check-out: ${checkOut}` : null,
      fullName ? `Name: ${fullName}` : null,
      phone ? `Phone: ${phone}` : null,
      "",
      `Apartment ID: ${apt._id}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [apt, checkIn, checkOut, fullName, phone]);

  if (loading) {
    return <div className="p-20 text-center text-gray-500">Loading...</div>;
  }

  if (!apt) {
    return (
      <div className="p-20 text-center text-gray-600">
        Apartment not found.
      </div>
    );
  }

  const images = apt.images?.length ? apt.images : ["/placeholder.jpg"];

  const aptLite: ApartmentLite = {
    _id: apt._id,
    title: apt.title,
    location: apt.location,
    price: apt.price,
    rooms: apt.rooms,
    images: apt.images,
    available: apt.available,
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => {
              const nowSaved = toggleSaved(aptLite);
              setSaved(nowSaved);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              saved
                ? "bg-black text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {saved ? "Saved" : "Save"}
          </button>

          <a
            href={waLink(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
          >
            Book on WhatsApp
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <img
            src={activeImg || images[0]}
            alt={apt.title}
            className="w-full h-[420px] object-cover rounded-2xl border"
          />

          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 8).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(img)}
                className={`rounded-xl overflow-hidden border transition ${
                  (activeImg || images[0]) === img
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                title="View image"
              >
                <img
                  src={img}
                  alt={`${apt.title} ${idx}`}
                  className="w-full h-20 object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold">{apt.title}</h1>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded ${
                apt.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {apt.available ? "Available" : "Booked"}
            </span>
          </div>

          <p className="text-gray-600 mt-2">
            <span className="font-semibold text-gray-800">Address:</span>{" "}
            {apt.location}
          </p>

          <p className="text-yellow-500 text-2xl font-bold mt-4">
            ₦{Number(apt.price).toLocaleString()}{" "}
            <span className="text-sm text-gray-500">/ Night</span>
          </p>

          <p className="text-gray-700 mt-2">{apt.rooms} Rooms</p>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {apt.description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Check-in (optional)</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Check-out (optional)</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Your Name (optional)</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Musty"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone (optional)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0810..."
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <a
            href={waLink(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Book on WhatsApp
          </a>

          <p className="text-xs text-gray-500 mt-3">
            You’ll be redirected to WhatsApp with your booking details already typed.
          </p>
        </div>
      </div>
    </main>
  );
}