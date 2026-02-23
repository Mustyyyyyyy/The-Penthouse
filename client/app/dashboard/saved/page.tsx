"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { getSaved, toggleSaved, type ApartmentLite } from "@/lib/CustomerStore";

export default function SavedApartmentsPage() {
  const [saved, setSaved] = useState<ApartmentLite[]>([]);

  useEffect(() => {
    setSaved(getSaved());
  }, []);

  const remove = (apt: ApartmentLite) => {
    toggleSaved(apt);
    setSaved(getSaved());
  };

  return (
    <RequireAuth>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">My Favorites</h1>
            <p className="text-gray-600 mt-2">Saved apartments are stored on your device.</p>
          </div>
          <Link href="/dashboard" className="underline">
            Back to Dashboard
          </Link>
        </div>

        {saved.length === 0 ? (
          <div className="mt-10 text-gray-600">
            You haven’t saved any apartment yet.{" "}
            <Link href="/apartments" className="underline font-semibold">
              Browse apartments
            </Link>
            .
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {saved.map((apt) => (
              <div key={apt._id} className="border rounded-2xl overflow-hidden">
                <img
                  src={apt.images?.[0] || "/placeholder.jpg"}
                  alt={apt.title}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <p className="font-semibold">{apt.title}</p>
                  <p className="text-sm text-gray-500">{apt.location}</p>
                  <p className="text-sm font-bold text-yellow-600 mt-2">
                    ₦{Number(apt.price).toLocaleString()} / Night
                  </p>

                  <div className="flex gap-3 mt-4">
                    <Link
                      href={`/apartments/${apt._id}`}
                      className="flex-1 bg-black text-white text-center py-2 rounded-lg"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => remove(apt)}
                      className="flex-1 border text-center py-2 rounded-lg hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </RequireAuth>
  );
}