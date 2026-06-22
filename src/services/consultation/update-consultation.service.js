const Consultation = require("../../models/consultation");

const updateConsultationService = async (consultationId, data, updatedBy) => {
  const consultation = await Consultation.findOne({
    _id: consultationId,

    isDeleted: false,
  });

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  Object.assign(consultation, data);

  consultation.updatedBy = updatedBy;

  await consultation.save();

  return consultation;
};

module.exports = updateConsultationService;
