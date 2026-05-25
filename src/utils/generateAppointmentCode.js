const Counter = require("../models/Counter");

const generateAppointmentCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "appointmentCode" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return "APP" + String(counter.seq).padStart(3, "0");
};

module.exports = generateAppointmentCode;