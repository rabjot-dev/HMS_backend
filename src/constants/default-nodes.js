const ROLES = require("./roles");

module.exports = [

 //dashboards 

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
    name: "Doctor Dashboard",
    path: "/dashboard/doctor",
    icon: "dashboard",
    order: 2,
    roles: [
      ROLES.DOCTOR,
    ],
  },

  {
    name: "Receptionist Dashboard",
    path: "/dashboard/receptionist",
    icon: "dashboard",
    order: 3,
    roles: [
      ROLES.RECEPTIONIST,
    ],
  },

// parent menus 

  {
    name: "Employees",
    path: "/employees",
    icon: "groups",
    order: 10,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    name: "Patients",
    path: "/patients",
    icon: "people",
    order: 20,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },

  {
    name: "Appointments",
    path: "/appointments",
    icon: "event",
    order: 30,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },

  {
    name: "Consultations",
    path: "/consultations",
    icon: "description",
    order: 40,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },

  {
    name: "Doctor Queue",
    path: "/doctor-queue",
    icon: "queue",
    order: 50,
    roles: [
      ROLES.DOCTOR,
    ],
  },

  {
    name: "Doctor Availability",
    path: "/doctor-availability",
    icon: "schedule",
    order: 60,
    roles: [
      ROLES.DOCTOR,
    ],
  },

  {
    name: "My Profile",
    path: "/my-profile",
    icon: "account_circle",
    order: 100,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
    ],
  },
];