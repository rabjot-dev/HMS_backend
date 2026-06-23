const HealthRecord = require("../../models/HealthRecord");
const { buildSearchFilter } = require("../../utils/pagination");

const getHealthRecords = async ({
  patientId,
  user,
  skip,
  limit,
  sort,
  search,
  documentType,
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

  if (search) {
    Object.assign(
      filter,
      buildSearchFilter(
        [
          "title",
          "documentType",
          "notes",
          "originalFileName",
        ],
        search
      )
    );
  }

  const total = await HealthRecord.countDocuments(filter);

  const records = await HealthRecord.find(filter)
    .populate("patientId")
    .populate("createdBy", "email roles")
    .populate("updatedBy", "email roles")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    records,
    total,
  };
};

module.exports = getHealthRecords;
