require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const MenuNode = require("../models/MenuNode");

const menuNodes = [
  {
    label: "Dashboard",
    path: "/dashboard/admin",
    icon: "H",
    allowedRoles: ["ADMIN"],
    order: 1,
    isActive: true,
  },
  {
    label: "Dashboard",
    path: "/dashboard/doctor",
    icon: "H",
    allowedRoles: ["DOCTOR"],
    order: 1,
    isActive: true,
  },
  {
    label: "Dashboard",
    path: "/dashboard/receptionist",
    icon: "H",
    allowedRoles: ["RECEPTIONIST"],
    order: 1,
    isActive: true,
  },
  {
    label: "Employees",
    path: "/employees",
    icon: "E",
    allowedRoles: ["ADMIN"],
    order: 2,
    isActive: true,
  },
  {
    label: "Add Employee",
    path: "/employees/create",
    icon: "+",
    allowedRoles: ["ADMIN"],
    order: 3,
    isActive: true,
  },
  {
    label: "Pending Requests",
    path: "/employees/pending",
    icon: "P",
    allowedRoles: ["ADMIN"],
    order: 4,
    isActive: true,
  },
  {
    label: "Patients",
    path: "/patients",
    icon: "U",
    allowedRoles: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
    order: 5,
    isActive: true,
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: "A",
    allowedRoles: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
    order: 6,
    isActive: true,
  },
  {
    label: "Queue",
    path: "/doctor-queue",
    icon: "Q",
    allowedRoles: ["DOCTOR"],
    order: 7,
    isActive: true,
  },
  {
    label: "Availability",
    path: "/doctor-availability",
    icon: "T",
    allowedRoles: ["DOCTOR"],
    order: 8,
    isActive: true,
  },
];

const seedMenuNodes = async () => {
  await connectDB();

  for (const menuNode of menuNodes) {
    await MenuNode.findOneAndUpdate({ path: menuNode.path }, menuNode, {
      upsert: true,
      returnDocument: "after",
    });
  }

  await MenuNode.deleteOne({ path: "/medical-records" });

  console.log("Menu nodes seeded successfully");
  await mongoose.connection.close();
};

seedMenuNodes().catch(async (error) => {
  console.error("Menu node seed failed", error);
  await mongoose.connection.close();
  process.exit(1);
});
