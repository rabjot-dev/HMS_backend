const asyncHandler = require("../utils/asyncHandler");
const getMyMenuService = require("../services/menu-node/get-my-menu.service");

const getMyMenu = asyncHandler(async (req, res) => {
  const menus = await getMyMenuService(req.user.roles);

  return res.status(200).json({
    success: true,
    message: "Menu nodes fetched successfully",
    data: menus,
  });
});

module.exports = {
  getMyMenu,
};
