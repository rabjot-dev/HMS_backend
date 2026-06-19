const Node =
  require("../../models/Node");

const updateNodeService =
  async (
    id,
    updateData,
    userId
  ) => {
    return Node.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        ...updateData,
        updatedBy:
          userId,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  };

module.exports =
  updateNodeService;