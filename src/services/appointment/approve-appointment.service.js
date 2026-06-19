const Appointment = require("../../models/Appointment");
const Patient = require("../../models/Patient");
const Employee = require("../../models/Employee");

const STATUS = require("../../constants/status");

const sendEmail = require("../../utils/sendEmail");
const appointmentApprovedTemplate = require("../../templates/appointment-approved.template");

const approveAppointment = async (
  appointmentId,
  approvedBy
) => {
  const appointment =
    await Appointment.findOne({
      _id: appointmentId,
      isDeleted: false,
    });

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  if (
    appointment.status !==
    STATUS.PENDING
  ) {
    throw new Error(
      "Only pending appointments can be approved"
    );
  }

  const todayAppointmentsCount =
    await Appointment.countDocuments({
      doctorEmployeeId:
        appointment.doctorEmployeeId,

      appointmentDate:
        appointment.appointmentDate,

      status: {
        $in: [
          STATUS.BOOKED,
          STATUS.IN_CONSULTATION,
          STATUS.COMPLETED,
        ],
      },

      isDeleted: false,
    });

  appointment.tokenNumber =
    todayAppointmentsCount + 1;

  appointment.status =
    STATUS.BOOKED;

  appointment.approvedBy =
    approvedBy;

  appointment.approvalDate =
    new Date();

  appointment.rejectedBy = null;
  appointment.rejectedDate = null;
  appointment.rejectionReason = null;

  await appointment.save();

  const patient =
    await Patient.findOne({
      _id:
        appointment.patientId,
      isDeleted: false,
    });

  const doctor =
    await Employee.findOne({
      _id:
        appointment.doctorEmployeeId,
      isDeleted: false,
    });

  if (patient?.email) {
    const htmlContent =
      appointmentApprovedTemplate({
        patientName:
          `${patient.firstName} ${patient.lastName}`,

        doctorName:
          doctor?.name,

        appointmentDate:
          appointment.appointmentDate
            .toISOString()
            .split("T")[0],

        appointmentTime:
          appointment.timeSlot,

        tokenNumber:
          appointment.tokenNumber,
      });

    await sendEmail({
      to: patient.email,
      subject:
        "Appointment Approved",
      htmlContent,
    });
  }

  return appointment;
};

module.exports =
  approveAppointment;