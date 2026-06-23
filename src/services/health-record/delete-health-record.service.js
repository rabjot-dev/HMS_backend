const HealthRecord = require("../../models/HealthRecord");
const ERR = require("../../utils/errors");

const deleteHealthRecord = async (id, deletedBy) => {
  const record = await HealthRecord.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });

  if (!record) {
    throw ERR.healthRecordNotFound();
  }

  record.isDeleted = true;
  record.deletedBy = deletedBy;
  record.deletedDate = new Date();

  await record.save();

  return record;
};

module.exports = deleteHealthRecord;
