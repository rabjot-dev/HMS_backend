const Patient =
  require("../../models/Patient");

const updateMyProfile =
  async (
    patientId,
    updateData,
    updatedBy
  ) => {
    if (
      updateData.maritalStatus ===
      ""
    ) {
      delete updateData.maritalStatus;
    }

    if (
      updateData.gender === ""
    ) {
      delete updateData.gender;
    }

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

    Object.assign(
      patient,
      updateData
    );

    patient.updatedBy =
      updatedBy;

    await patient.save();

    return patient;
  };

module.exports =
  updateMyProfile;