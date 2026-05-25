const Counter = require("../models/Counter");

const generatePatientCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "patientCode" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return "PAT" + String(counter.seq).padStart(3, "0");
};

module.exports = generatePatientCode;
