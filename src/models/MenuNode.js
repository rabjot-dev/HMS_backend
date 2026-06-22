const mongoose = require("mongoose");

const menuNodeSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    path: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuNode",
      default: null,
    },

    icon: {
      type: String,
      default: "",
      trim: true,
    },

    allowedRoles: {
      type: [String],
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MenuNode", menuNodeSchema);
