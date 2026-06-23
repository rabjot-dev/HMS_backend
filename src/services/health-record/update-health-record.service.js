const HealthRecord = require("../../models/HealthRecord");
const ERR = require("../../utils/errors");

const updateHealthRecord = async (id, updateData, file, user) => {
  const { patientId, createdBy, deletedBy, deletedDate, isDeleted, ...safeData } =
    updateData;

  if (file) {
    safeData.filePath = `/uploads/health-records/${file.filename}`;
    safeData.originalFileName = file.originalname;
    safeData.mimeType = file.mimetype;
    safeData.fileSize = file.size;
  }

  const record = await HealthRecord.findOneAndUpdate(
    {
      _id: id,
      isDeleted: { $ne: true },
    },
    {
      ...safeData,
      updatedBy: user.userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!record) {
    throw ERR.healthRecordNotFound();
  }

  return record;
};

module.exports = updateHealthRecord;
