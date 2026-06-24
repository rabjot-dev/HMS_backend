const HealthRecord = require("../../models/HealthRecord");

const getHealthRecords = async ({
  patientId,
  user,
  documentType,
  excludeDocumentType,
  skip,
  limit,
  sort,
}) => {
  const filter = {
    isDeleted: { $ne: true },
  };

  if (patientId) {
    filter.patientId = patientId;
  }

  if (user.roles?.includes("PATIENT")) {
    filter.patientId = user.patientId;
  }

  if (documentType) {
    filter.documentType = documentType;
  }

  if (excludeDocumentType) {
    filter.documentType = { $ne: excludeDocumentType };
  }

  const total = await HealthRecord.countDocuments(filter);

  const records = await HealthRecord.find(filter)
    .populate("patientId")
    .populate("createdBy", "email roles")
    .populate("updatedBy", "email roles")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    records,
    total,
  };
};

module.exports = getHealthRecords;
