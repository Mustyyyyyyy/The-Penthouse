"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddApartment() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const [images, setImages] = useState<string[]>([""]);

  const [available, setAvailable] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const cleanImages = images.map((x) => x.trim()).filter(Boolean);

    await fetch("http://localhost:5000/api/admin/apartments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
      body: JSON.stringify({
        title,
        description,
        price: Number(price),
        rooms: Number(rooms),
        bathrooms: Number(bathrooms),
        images: cleanImages,
        available,
      }),
    });

    router.push("/admin");
  };

  return (
    <main className="min-h-screen p-10">
      <a href="/admin/dashboard" className="text-sm underline">
        Dashboard
      </a>

      <h1 className="text-3xl font-bold mb-10">Add New Apartment</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <input
          placeholder="Title"
          className="border p-3 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="border p-3 w-full min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-3 w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Rooms"
          className="border p-3 w-full"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Bathrooms"
          className="border p-3 w-full"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          required
        />

        <div className="space-y-3">
          <label className="font-medium">Apartment Images</label>

          {images.map((img, index) => (
            <input
              key={index}
              value={img}
              placeholder="Paste image URL (Unsplash recommended)"
              className="border p-3 w-full"
              onChange={(e) => {
                const copy = [...images];
                copy[index] = e.target.value;
                setImages(copy);
              }}
            />
          ))}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setImages([...images, ""])}
              className="text-blue-600 text-sm underline"
            >
              + Add another image
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setImages(images.slice(0, -1))}
                className="text-red-600 text-sm underline"
              >
                Remove last
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Tip: Add 3–6 images for a more professional listing.
          </p>
        </div>

        <label className="flex gap-3 items-center">
          Available
          <input
            type="checkbox"
            checked={available}
            onChange={() => setAvailable(!available)}
          />
        </label>

        <button type="submit" className="bg-black text-white px-6 py-3">
          Create Apartment
        </button>
      </form>
    </main>
  );
}