const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { sendWelcomeEmail } = require("../utils/mailer");


router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already exists" });

    const user = await User.create({
      name: fullName,         
      email,
      password,
      role: "customer",
    });

    sendWelcomeEmail({ to: user.email, name: user.name })
      .then(() => console.log(" Welcome email sent to", user.email))
      .catch((e) => console.error(" Welcome email failed:", e?.message || e));

    return res.json({
      token: generateToken(user._id, user.role),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  res.json({
    token: generateToken(user._id, user.role),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


module.exports = router;