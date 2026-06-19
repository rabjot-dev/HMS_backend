const Node =
  require("../../models/Node");

const getNodesService =
  async (user) => {
    return Node.find({
      roles: {
        $in:
          user.roles,
      },
      isActive: true,
      isDeleted: false,
    })
      .select(
        "name path icon parent order"
      )
      .sort({
        order: 1,
      })
      .lean();
  };

module.exports =
  getNodesService;