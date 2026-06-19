const Consultation =
  require("../../models/consultation");

const getConsultationByIdService =
  async (id) => {
    const consultation =
      await Consultation.findOne({
        _id: id,
        isDeleted: false,
      })
        .populate({
          path:
            "patientId",

          match: {
            isDeleted:
              false,
          },
        })
        .populate({
          path:
            "doctorEmployeeId",

          match: {
            isDeleted:
              false,
          },
        })
        .populate({
          path:
            "appointmentId",

          match: {
            isDeleted:
              false,
          },
        });

    if (
      !consultation
    ) {
      throw new Error(
        "Consultation not found"
      );
    }

    return consultation;
  };

module.exports =
  getConsultationByIdService;