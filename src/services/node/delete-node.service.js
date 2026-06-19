const Node =
  require("../../models/Node");

const deleteNodeService =
  async (
    id,
    userId
  ) => {
    const node =
      await Node.findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          isDeleted: true,
          deletedBy:
            userId,
          deletedAt:
            new Date(),
        },
        {
          new: true,
        }
      );

    if (!node) {
      throw new Error(
        "Node not found"
      );
    }

    return {
      message:
        "Node deleted successfully",
    };
  };

module.exports =
  deleteNodeService;