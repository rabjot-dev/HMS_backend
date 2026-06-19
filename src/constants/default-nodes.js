const ROLES =
  require("./roles");

module.exports = [
  {
    name: "Admin Dashboard",
    path: "/dashboard/admin",
    icon: "dashboard",
    order: 1,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    name: "Doctor ashboard",
    path: "/dashboard/doctor",
    icon: "dashboard",
    order: 1,
    roles: [
      ROLES.DOCTOR,
    ],
  },

  {
    name: "Receptionist Dashboard",
    path: "/dashboard/receptionist",
    icon: "dashboard",
    order: 1,
    roles: [
      ROLES.RECEPTIONIST,
    ],
  },

  {
    name: "Employees",
    path: "/employees",
    icon: "groups",
    order: 2,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    name: "Add Employee",
    path: "/employees/create",
    icon: "person_add",
    order: 3,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    name:
      "Pending Employees",
    path:
      "/employees/pending",
    icon:
      "pending_actions",
    order: 4,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    name: "Patients",
    path: "/patients",
    icon: "people",
    order: 5,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },

  {
    name: "Add Patient",
    path:
      "/patients/create",
    icon:
      "person_add",
    order: 6,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
    ],
  },

  {
    name:
      "Appointments",
    path:
      "/appointments",
    icon: "event",
    order: 7,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },

  {
    name:
      "Book Appointment",
    path:
      "/appointments/book",
    icon:
      "add_circle",
    order: 8,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },

  {
    name:
      "Appointment Requests",
    path:
      "/appointments/requests",
    icon:
      "event_note",
    order: 9,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
    ],
  },

  {
    name:
      "Doctor Queue",
    path:
      "/doctor-queue",
    icon: "queue",
    order: 10,
    roles: [
      ROLES.DOCTOR,
    ],
  },

  {
    name:
      "Consultations",
    path:
      "/consultations",
    icon:
      "description",
    order: 11,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },

  {
    name:
      "Doctor Availability",
    path:
      "/doctor-availability",
    icon:
      "schedule",
    order: 12,
    roles: [
      ROLES.DOCTOR,
    ],
  },

  {
    name:
      "My Profile",
    path:
      "/my-profile",
    icon:
      "account_circle",
    order: 13,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },
];