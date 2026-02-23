const router = require("express").Router();
const Apartment = require("../models/Apartment");

router.get("/", async (req, res) => {
  const apartments = await Apartment.find();
  res.json(apartments);
});

router.get("/:id", async (req, res) => {
  const apt = await Apartment.findById(req.params.id);
  res.json(apt);
});

module.exports = router;