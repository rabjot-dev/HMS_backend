const MenuNode = require("../../models/MenuNode");

const getMyMenuService = async (roles = []) => {
  return MenuNode.find({
    isActive: true,
    allowedRoles: { $in: roles },
  }).sort({ order: 1, label: 1 });
};

module.exports = getMyMenuService;
