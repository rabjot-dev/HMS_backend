const Consultation = require("../../models/consultation");

const getConsultationsService = async () => {
  return Consultation.find({
  isDeleted: false,
}) 
  .populate({
  path: "patientId",
  match: {
    isDeleted: false,
  },
})
.populate({
  path: "doctorEmployeeId",
  match: {
    isDeleted: false,
  },
})
.populate({
  path: "appointmentId",
  match: {
    isDeleted: false,
  },
})
    .sort({
      createdAt: -1,
    }).lean();
};

module.exports = getConsultationsService;
