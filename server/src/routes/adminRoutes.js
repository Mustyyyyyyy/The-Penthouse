const router = require("express").Router();
const Apartment = require("../models/Apartment");
const protect = require("../middlewares/protect");
const adminProtect = require("../middlewares/adminProtect");

function normalizeImages(body) {
  const imgs = Array.isArray(body.images)
    ? body.images
    : body.image
    ? [body.image]
    : [];

  return imgs.map((x) => String(x).trim()).filter(Boolean);
}

function pickApartmentPayload(body) {
  return {
    title: body.title,
    description: body.description,
    location: body.location,
    price: body.price !== undefined ? Number(body.price) : undefined,
    rooms: body.rooms !== undefined ? Number(body.rooms) : undefined,
    bathrooms: body.bathrooms !== undefined ? Number(body.bathrooms) : undefined,
    images: normalizeImages(body),
    available: body.available !== undefined ? Boolean(body.available) : true,
  };
}

router.post("/apartments", protect, adminProtect, async (req, res) => {
  try {
    const payload = pickApartmentPayload(req.body);

    if (!payload.title || !payload.description) {
      return res.status(400).json({ msg: "Title and description are required" });
    }

    const apt = await Apartment.create(payload);
    res.json(apt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Failed to create apartment" });
  }
});

router.put("/apartments/:id", protect, adminProtect, async (req, res) => {
  try {
    const payload = pickApartmentPayload(req.body);

    if (!("images" in req.body) && !("image" in req.body)) {
      delete payload.images;
    }

    const apt = await Apartment.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    if (!apt) return res.status(404).json({ msg: "Apartment not found" });
    res.json(apt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Failed to update apartment" });
  }
});

router.delete("/apartments/:id", protect, adminProtect, async (req, res) => {
  try {
    await Apartment.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Failed to delete apartment" });
  }
});

module.exports = router;