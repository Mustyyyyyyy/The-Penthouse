const Availability = require("../models/Apartment");

exports.setAvailability = async (req, res) => {
  const data = await Availability.create(req.body);
  res.json(data);
};

exports.getUnitAvailability = async (req, res) => {
  const data = await Availability.find({
    unitId: req.params.unitId
  });

  res.json(data);
};