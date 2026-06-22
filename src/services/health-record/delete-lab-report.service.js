const fs = require("fs");
const path = require("path");

const Patient = require("../../models/Patient");

const ApiError = require("../../utils/ApiError");

const deleteLabReportService = async (patientId, reportId) => {
  const patient = await Patient.findOne({
    _id: patientId,
    isDeleted: false,
  });

  if (!patient) {
    throw new ApiError(404, "Patient not found", "PATIENT_NOT_FOUND");
  }

  const report = patient.labReports.id(reportId);

  if (!report) {
    throw new ApiError(404, "Lab report not found", "LAB_REPORT_NOT_FOUND");
  }

  /*
    |---------------------------------------
    | Delete Physical File
    |---------------------------------------
    */

  if (report.documentUrl) {
    const filePath = path.join(
      process.cwd(),
      report.documentUrl.replace(/^\//, ""),
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  report.deleteOne();

  await patient.save();

  return {
    message: "Lab report deleted successfully",
  };
};

module.exports = deleteLabReportService;
