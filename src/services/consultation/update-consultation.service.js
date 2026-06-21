const Consultation = require("../../models/Consultation");
const ERR = require("../../utils/errors");

const updateConsultationService = async (consultationId, data) => {
  const consultation = await Consultation.findByIdAndUpdate(
    consultationId,
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!consultation) {
throw ERR.consultationNotFound(); }

  return consultation;
};

module.exports = updateConsultationService;
