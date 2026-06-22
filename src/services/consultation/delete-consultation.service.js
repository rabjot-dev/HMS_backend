const Consultation = require("../../models/consultation");

const deleteConsultationService = async (consultationId, deletedBy) => {
  const consultation = await Consultation.findOne({
    _id: consultationId,
    isDeleted: false,
  });

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  consultation.isDeleted = true;

  consultation.deletedBy = deletedBy;

  consultation.deletedAt = new Date();

  await consultation.save();

  return {
    message: "Consultation deleted successfully",
  };
};

module.exports = deleteConsultationService;
