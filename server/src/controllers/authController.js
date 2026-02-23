const Unit = require("../models/Unit");

exports.createUnit = async (req, res) => {
  const unit = await Unit.create(req.body);
  res.json(unit);
};

exports.getUnits = async (req, res) => {
  const units = await Unit.find({ isActive: true });
  res.json(units);
};

exports.updateUnit = async (req, res) => {
  const unit = await Unit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(unit);
};