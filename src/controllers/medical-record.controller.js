const mongoose = require("mongoose");

const asyncHandler = require("../utils/asyncHandler");
const ERR = require("../utils/errors");
const { getPagination, getPaginationMeta } = require("../utils/pagination");
const getPrescriptionsService = require("../services/medical-record/get-prescriptions.service");
const getPrescriptionByIdService = require("../services/medical-record/get-prescription-by-id.service");

const getPrescriptions = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, search, status, fromDate, toDate } =
    getPagination(req.query, {
      allowedSortFields: ["createdAt", "updatedAt", "status"],
      defaultSort: { createdAt: -1 },
    });

  const { prescriptions, total } = await getPrescriptionsService({
    user: req.user,
    skip,
    limit,
    sort,
    search,
    status,
    fromDate,
    toDate,
  });

  return res.status(200).json({
    success: true,
    message: "Prescriptions retrieved successfully",
    data: prescriptions,
    pagination: getPaginationMeta({
      page,
      limit,
      total,
    }),
  });
});

const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw ERR.invalidPatientId();
  }

  const { page, limit, skip, sort, search, status, fromDate, toDate } =
    getPagination(req.query, {
      allowedSortFields: ["createdAt", "updatedAt", "status"],
      defaultSort: { createdAt: -1 },
    });

  const { prescriptions, total } = await getPrescriptionsService({
    user: req.user,
    patientId,
    skip,
    limit,
    sort,
    search,
    status,
    fromDate,
    toDate,
  });

  return res.status(200).json({
    success: true,
    message: "Patient prescriptions retrieved successfully",
    data: prescriptions,
    pagination: getPaginationMeta({
      page,
      limit,
      total,
    }),
  });
});

const getMyPrescriptions = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, search, status, fromDate, toDate } =
    getPagination(req.query, {
      allowedSortFields: ["createdAt", "updatedAt", "status"],
      defaultSort: { createdAt: -1 },
    });

  const { prescriptions, total } = await getPrescriptionsService({
    user: req.user,
    skip,
    limit,
    sort,
    search,
    status,
    fromDate,
    toDate,
  });

  return res.status(200).json({
    success: true,
    message: "My prescriptions retrieved successfully",
    data: prescriptions,
    pagination: getPaginationMeta({
      page,
      limit,
      total,
    }),
  });
});

const getPrescriptionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ERR.invalidConsultationId();
  }

  const prescription = await getPrescriptionByIdService(id, req.user);

  return res.status(200).json({
    success: true,
    message: "Prescription retrieved successfully",
    data: prescription,
  });
});

const getLabReports = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Lab reports module will be implemented later",
    data: [],
    pagination: getPaginationMeta({
      page: 1,
      limit: 10,
      total: 0,
    }),
  });
});

module.exports = {
  getPrescriptions,
  getPatientPrescriptions,
  getMyPrescriptions,
  getPrescriptionById,
  getLabReports,
};
