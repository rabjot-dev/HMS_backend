const HealthRecord = require("../../models/HealthRecord");
const ERR = require("../../utils/errors");

const getHealthRecordById = async (id, user) => {
  const filter = {
    _id: id,
    isDeleted: { $ne: true },
  };

  if (user.roles?.includes("PATIENT")) {
    filter.patientId = user.patientId;
  }

  const record = await HealthRecord.findOne(filter)
    .populate("patientId")
    .populate("createdBy", "email roles")
    .populate("updatedBy", "email roles");

  if (!record) {
    throw ERR.healthRecordNotFound();
  }

  return record;
};

module.exports = getHealthRecordById;
