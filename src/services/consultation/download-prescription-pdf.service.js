const Consultation =
  require("../../models/consultation");

const getPrescriptionDataService =
  async (
    consultationId
  ) => {
    const consultation =
      await Consultation.findOne({
        _id:
          consultationId,

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
  getPrescriptionDataService;