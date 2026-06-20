const connectDB = require("../config/db");
const Node = require("../models/Node");
const ROLES = require("../constants/roles");
const mongoose = require("mongoose");
require("dotenv").config();

const seedNodeChildren = async () => {
  try {
    await connectDB();

    const employees =
      await Node.findOne({
        path: "/employees",
      });

    const patients =
      await Node.findOne({
        path: "/patients",
      });

    const appointments =
      await Node.findOne({
        path: "/appointments",
      });

    // =====================
    // Employee Children
    // =====================

   await Node.findOneAndUpdate(
  {
    path: "/employees/create",
  },
  {
    name: "Add Employee",
    icon: "person_add",
    parent: employees._id,
    order: 11,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
    isDeleted: false,
    isActive: true,
  },
  {
    upsert: true,
   returnDocument: "after",
    setDefaultsOnInsert: true,
  }
);
    await Node.findOneAndUpdate(
  {
    path: "/employees/pending",
  },
  {
    name: "Pending Employees",
    icon: "pending_actions",
    parent: employees._id,
    order: 12,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
    isDeleted: false,
    isActive: true,
  },
  {
    upsert: true,
   returnDocument: "after",
    setDefaultsOnInsert: true,
  }
);

    // =====================
    // Patient Children
    // =====================

    await Node.findOneAndUpdate(
  {
    path: "/patients/create",
  },
  {
    name: "Add Patient",
    icon: "person_add",
    parent: patients._id,
    order: 21,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
    ],
    isDeleted: false,
    isActive: true,
  },
  {
    upsert: true,
  returnDocument: "after",
    setDefaultsOnInsert: true,
  }
);
    // =====================
    // Appointment Children
    // =====================
await Node.findOneAndUpdate(
  {
    path: "/appointments/book",
  },
  {
    name: "Book Appointment",
    icon: "add_circle",
    parent: appointments._id,
    order: 31,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
    ],
    isDeleted: false,
    isActive: true,
  },
  {
    upsert: true,
  returnDocument: "after",
    setDefaultsOnInsert: true,
  }
);

  await Node.findOneAndUpdate(
  {
    path: "/appointments/requests",
  },
  {
    name: "Appointment Requests",
    icon: "event_note",
    parent: appointments._id,
    order: 32,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
    ],
    isDeleted: false,
    isActive: true,
  },
  {
    upsert: true,
returnDocument: "after",
    setDefaultsOnInsert: true,
  }
);

    console.log(
      "Node children seeded successfully"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "NODE CHILD SEED ERROR:",
      error
    );

    process.exit(1);
  }
};

seedNodeChildren();