require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User"); 

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@ogbapt.com";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  await User.create({
    name: "Main Admin",
    email: email,
    password: "admin123", 
    role: "admin",
  });

  console.log("Admin created!");
  console.log("Login with:");
  console.log("Email: admin@ogbapt.com");
  console.log("Password: admin123");

  process.exit();
}

run();