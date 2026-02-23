const Admin = require("../models/Booking");
const { comparePassword } = require("../utils/hash");
const { signAdminToken } = require("../utils/generateToken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const valid = await comparePassword(password, admin.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = signAdminToken(admin);
  res.json({ token, admin });
};