const fs = require("fs");
const path = require("path");

const Patient = require("../../models/Patient");

const ApiError = require("../../utils/ApiError");

const deleteMedicalDocumentService = async (patientId, documentId) => {
  const patient = await Patient.findOne({
    _id: patientId,
    isDeleted: false,
  });

  if (!patient) {
    throw new ApiError(404, "Patient not found", "PATIENT_NOT_FOUND");
  }

  const document = patient.medicalDocuments.id(documentId);

  if (!document) {
    throw new ApiError(404, "Medical document not found", "DOCUMENT_NOT_FOUND");
  }

  /*
    |---------------------------------------
    | Delete Physical File
    |---------------------------------------
    */

  if (document.documentUrl) {
    const filePath = path.join(
      process.cwd(),
      document.documentUrl.replace(/^\//, ""),
    );

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  document.deleteOne();

  await patient.save();

  return {
    message: "Medical document deleted successfully",
  };
};

module.exports = deleteMedicalDocumentService;
