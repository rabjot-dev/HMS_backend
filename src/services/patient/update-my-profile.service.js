const Patient = require("../../models/Patient");

const updateMyProfile =
  async (
    patientId,
    updateData
  ) => {

    const patient =
      await Patient.findByIdAndUpdate(
        patientId,

        updateData,

        {
          new: true,
          runValidators: true,
        }
      );

    if (!patient) {

      throw new Error(
        "Patient not found"
      );
    }

    return patient;
  };

module.exports =
  updateMyProfile;