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
  const [image, setImage] = useState("");
  const [available, setAvailable] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/admin/apartments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!
      },
      body: JSON.stringify({
        title,
        description,
        price,
        rooms,
        bathrooms,
        image,
        available
      })
    });

    router.push("/admin");
  };

  return (

    <main className="min-h-screen p-10">
      <a href="/admin/dashboard" className="text-sm underline">
          Dashboard
        </a>

      <h1 className="text-3xl font-bold mb-10">
        Add New Apartment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl"
      >

        <input
          placeholder="Title"
          className="border p-3 w-full"
          onChange={(e)=>setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="border p-3 w-full"
          onChange={(e)=>setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-3 w-full"
          onChange={(e)=>setPrice(e.target.value)}
        />

        <input
          placeholder="Rooms"
          className="border p-3 w-full"
          onChange={(e)=>setRooms(e.target.value)}
        />

        <input
          placeholder="Bathrooms"
          className="border p-3 w-full"
          onChange={(e)=>setBathrooms(e.target.value)}
        />

        <input
          placeholder="Image URL"
          className="border p-3 w-full"
          onChange={(e)=>setImage(e.target.value)}
        />

        <label className="flex gap-3 items-center">
          Available
          <input
            type="checkbox"
            checked={available}
            onChange={()=>setAvailable(!available)}
          />
        </label>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3"
        >
          Create Apartment
        </button>

      </form>

    </main>
  );
}