const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("../server/src/config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://the-penthouse-five.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("", (req, res) => {
  res.send("Welcome to the Apartment Management System API");
});

app.options("", cors());

app.use(express.json());

app.use("/api/auth", require("../server/src/routes/authRoutes"));
app.use("/api/admin", require("../server/src/routes/adminRoutes"));
app.use("/api/apartments", require("../server/src/routes/apartmentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));