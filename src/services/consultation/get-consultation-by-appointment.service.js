const Consultation =
  require("../../models/consultation");

const getConsultationByAppointmentService =
  async (
    appointmentId
  ) => {
    const consultation =
      await Consultation.findOne({
        appointmentId,
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
  getConsultationByAppointmentService;