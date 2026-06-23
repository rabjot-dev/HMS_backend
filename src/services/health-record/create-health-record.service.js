const HealthRecord = require("../../models/HealthRecord");
const Patient = require("../../models/Patient");
const ERR = require("../../utils/errors");

const createHealthRecord = async (recordData, file, user) => {
  const patient = await Patient.findOne({
    _id: recordData.patientId,
    isDeleted: { $ne: true },
  });

  if (!patient) {
    throw ERR.patientNotFound();
  }

  return HealthRecord.create({
    patientId: recordData.patientId,
    title: recordData.title,
    documentType: recordData.documentType,
    documentDate: recordData.documentDate,
    notes: recordData.notes,
    filePath: `/uploads/health-records/${file.filename}`,
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    createdBy: user.userId,
  });
};

module.exports = createHealthRecord;
