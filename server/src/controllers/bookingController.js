const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signUserToken } = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const hashed = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashed
  });

  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = signUserToken(user);
  res.json({ token, user });
};