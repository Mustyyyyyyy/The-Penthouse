const mongoose = require("mongoose");
require("dotenv").config();

const Apartment = require("../models/Apartment"); 

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};

const locations = [
  "Takie Area, Ogbomoso",
  "Owode, Ogbomoso",
  "Under G Area, Ogbomoso",
  "Oke-Aanu, Ogbomoso",
  "Isale Ora, Ogbomoso",
  "Oolo, Ogbomoso",
  "LAUTECH Gate, Ogbomoso",
];

const titles = [
  "Luxury Self-Contain",
  "Executive Mini Flat",
  "Modern 2 Bedroom Apartment",
  "Student Friendly Room",
  "Serviced Studio Apartment",
  "Premium Short-Stay Apartment",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice() {
  return Math.floor(Math.random() * 25000) + 8000;
}

function randomRooms() {
  return Math.floor(Math.random() * 3) + 1;
}

async function seed() {
  await connectDB();

  await Apartment.deleteMany();

  const apartments = [];

  for (let i = 0; i < 40; i++) {
    apartments.push({
      title: randomItem(titles),
      description:
        "Comfortable apartment with constant water supply, security and electricity. Close to major roads and shops.",
      price: randomPrice(),
      location: randomItem(locations),
      rooms: randomRooms(),
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      ],
      available: Math.random() > 0.2,
    });
  }

  await Apartment.insertMany(apartments);

  console.log("🔥 40 Apartments Inserted Successfully");
  process.exit();
}

seed();