const createNodeService = require("../services/node/create-node.service");

const getNodesService = require("../services/node/get-nodes.service");

const updateNodeService = require("../services/node/update-node.service");

const deleteNodeService = require("../services/node/delete-node.service");

const createNode = async (req, res, next) => {
  try {
    const node = await createNodeService(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Node created successfully",
      data: node,
    });
  } catch (error) {
    next(error);
  }
};

const getNodes = async (req, res, next) => {
  try {
    const nodes = await getNodesService(req.user);

    res.json({
      success: true,
      message: "Nodes retrieved successfully",
      data: nodes,
    });
  } catch (error) {
    next(error);
  }
};

const updateNode = async (req, res, next) => {
  try {
    const node = await updateNodeService(
      req.params.id,
      req.body,
      req.user.userId,
    );

    res.json({
      success: true,
      message: "Node updated successfully",
      data: node,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNode = async (req, res, next) => {
  try {
    const result = await deleteNodeService(req.params.id, req.user.userId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNode,
  getNodes,
  updateNode,
  deleteNode,
};
