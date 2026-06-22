const mongoose = require("mongoose");

const getHealthRecordsService =
  require("../services/health-record/get-health-records.service");

const getHealthRecordDetailsService =
  require("../services/health-record/get-health-record-details.service");
const addLabReportService = require("../services/health-record/add-lab-report.service")
const deleteLabReportService= require("../services/health-record/delete-lab-report.service")
const addMedicalDocumentService= require("../services/health-record/add-medical-document.service")
const deleteMedicaDocumentService= require("../services/health-record/delete-medical-document.service")
const getHealthRecords =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await getHealthRecordsService(
          req.user,
          req.query
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Health records retrieved successfully",
          data:
            result.data,
          meta:
            result.meta,
        });
    } catch (error) {
      next(error);
    }
  };

const getHealthRecordDetails =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        patientId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          patientId
        )
      ) {
        return res
          .status(400)
          .json({
            success:
              false,
            message:
              "Invalid patient ID",
          });
      }

      const result =
        await getHealthRecordDetailsService(
          patientId,
          req.user
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Health record retrieved successfully",
          data:
            result,
        });
    } catch (error) {
      next(error);
    }
  };
const addLabReport =
  async (
    req,
    res,
    next
  ) => {
    console.log(
  req.headers["content-type"]
);
    console.log(req.body);
console.log(req.file);
    try {
      const result =
        await addLabReportService(
          req.params.patientId,
          req.body,req.file,
          req.user.userId
        );

      return res
        .status(201)
        .json({
          success: true,
          message:
            "Lab report added successfully",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  };

const deleteLabReport =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await deleteLabReportService(
          req.params.patientId,
          req.params.reportId
        );

      return res
        .status(200)
        .json({
          success: true,
          ...result,
        });
    } catch (error) {
      next(error);
    }
  };

const addMedicalDocument =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await addMedicalDocumentService(
          req.params.patientId,
          req.body,req.file,
          req.user.userId
        );

      return res
        .status(201)
        .json({
          success: true,
          message:
            "Medical document added successfully",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  };

const deleteMedicalDocument =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await deleteMedicalDocumentService(
          req.params.patientId,
          req.params.documentId
        );

      return res
        .status(200)
        .json({
          success: true,
          ...result,
        });
    } catch (error) {
      next(error);
    }
    
  };
  
module.exports = {
  getHealthRecords,
  getHealthRecordDetails,
  addLabReport,
  deleteLabReport,
  addMedicalDocument,
  deleteMedicalDocument,
};