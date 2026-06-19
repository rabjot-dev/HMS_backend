const Patient =
  require("../../models/Patient");

const User =
  require("../../models/User");

const deletePatientService =
  async (
    patientId,
    deletedBy
  ) => {
    const patient =
      await Patient.findOne({
        _id: patientId,
        isDeleted: false,
      });

    if (!patient) {
      throw new Error(
        "Patient not found"
      );
    }

    patient.isDeleted = true;
    patient.deletedBy =
      deletedBy;
    patient.deletedAt =
      new Date();

    await patient.save();

    await User.findOneAndUpdate(
      {
        patientId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedBy,
        deletedAt:
          new Date(),
      }
    );

    return {
      message:
        "Patient deleted successfully",
    };
  };

module.exports =
  deletePatientService;