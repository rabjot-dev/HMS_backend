const Consultation = require("../../models/Consultation");
const Appointment = require("../../models/Appointment");
const getConsultationSearchFilter = require("../consultation/get-consultation-search-filter.service");
const { buildDateRangeFilter } = require("../../utils/pagination");
const ERR = require("../../utils/errors");

const getPrescriptionsService = async ({
  user,
  patientId,
  skip,
  limit,
  sort,
  search,
  status,
  fromDate,
  toDate,
}) => {
  const filter = {
    status: "COMPLETED",
  };

  if (patientId) {
    filter.patientId = patientId;
  }

  if (user.roles?.includes("DOCTOR")) {
    if (!patientId) {
      throw ERR.unauthorizedAccess();
    }

    const hasHandledPatient = await Appointment.exists({
      patientId,
      doctorEmployeeId: user.employeeId,
      isDeleted: { $ne: true },
    });

    if (!hasHandledPatient) {
      throw ERR.unauthorizedAccess();
    }
  }

  if (user.roles?.includes("PATIENT")) {
    filter.patientId = user.patientId;
  }

  if (search) {
    Object.assign(filter, await getConsultationSearchFilter(search));
  }

  Object.assign(filter, buildDateRangeFilter("createdAt", fromDate, toDate));

  const total = await Consultation.countDocuments(filter);

  const prescriptions = await Consultation.find(filter)
    .populate("patientId")
    .populate("doctorEmployeeId")
    .populate("appointmentId")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    prescriptions,
    total,
  };
};

module.exports = getPrescriptionsService;
