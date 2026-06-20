const mongoose = require("mongoose");
require("dotenv").config();
const connectDB =
  require("../config/db");

const Node =
  require("../models/Node");

const defaultNodes =
  require("../constants/default-nodes");

const seedNodes =
  async () => {
    try {
      await connectDB();

      for (const node of defaultNodes) {
  const existingNode =
    await Node.findOne({
      path: node.path,
    });

  if (!existingNode) {
    await Node.create(node);
  }
}

      console.log(
        "Default nodes seeded successfully"
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "NODE SEED ERROR:",
        error
      );

      process.exit(1);
    }
  };

seedNodes();