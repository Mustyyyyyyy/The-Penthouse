const router = require("express").Router();
const Apartment = require("../models/Apartment");
const protect = require("../middlewares/protect");
const adminProtect = require("../middlewares/adminProtect");

router.post("/apartments", protect, adminProtect, async (req, res) => {
  const apt = await Apartment.create(req.body);
  res.json(apt);
});

router.put("/apartments/:id", protect, adminProtect, async (req, res) => {
  const apt = await Apartment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(apt);
});

router.delete("/apartments/:id", protect, adminProtect, async (req, res) => {
  await Apartment.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;