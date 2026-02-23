"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/axios";

type Apartment = {
  _id: string;
  title: string;
  location: string;
  price: number;
  rooms: number;
  images: string[];
  available: boolean;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/apartments");
      setApartments(res.data);
    } catch (err: any) {
      console.log("LOAD APTS ERROR:", err?.response?.data || err);
      setError(err?.response?.data?.msg || "Failed to load apartments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    const ok = window.confirm("Delete this apartment? This cannot be undone.");
    if (!ok) return;

    setBusyId(id);
    try {
      await api.delete(`/admin/apartments/${id}`);
      setApartments((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      console.log("DELETE ERROR:", err?.response?.data || err);
      alert(err?.response?.data?.msg || "Failed to delete apartment.");
    } finally {
      setBusyId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  return (
    <RequireRole allowed={["admin", "staff"]} redirectTo="/admin/login">
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
              <h1 className="text-3xl font-bold mt-1">Apartments</h1>
              <p className="text-gray-600 mt-2">
                Manage listings, availability, and details.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/admin/add")}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900"
              >
                Add Apartment
              </button>
              <button
                onClick={logout}
                className="border px-5 py-2 rounded-lg hover:bg-white"
              >
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 text-red-700 rounded-lg p-3">
              {error}{" "}
              <button className="underline ml-2" onClick={load}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="mt-10 text-gray-600">Loading apartments...</div>
          ) : apartments.length === 0 ? (
            <div className="mt-10 text-gray-600">No apartments yet.</div>
          ) : (
            <div className="mt-8 overflow-x-auto bg-white border rounded-2xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Location</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Rooms</th>
                    <th className="p-4 text-left">Available</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {apartments.map((apt) => (
                    <tr key={apt._id} className="border-t">
                      <td className="p-4 font-medium">{apt.title}</td>
                      <td className="p-4 text-gray-600">{apt.location}</td>
                      <td className="p-4">₦{Number(apt.price).toLocaleString()}</td>
                      <td className="p-4">{apt.rooms}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            apt.available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {apt.available ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/edit/${apt._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => onDelete(apt._id)}
                            disabled={busyId === apt._id}
                            className="text-red-600 hover:underline disabled:opacity-50"
                          >
                            {busyId === apt._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </RequireRole>
  );
}