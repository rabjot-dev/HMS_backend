const Counter = require("../models/Counter");

const generateEmployeeCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "employeeCode" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return "EMP" + String(counter.seq).padStart(3, "0");
};

module.exports = generateEmployeeCode;