const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const {
  createMenuNode,
  getMenuNodes,
  getMyMenu,
  updateMenuNode,
  deleteMenuNode,
} = require("../controllers/menu-node.controller");

const router = express.Router();

router.get("/my-menu", authMiddleware, getMyMenu);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createMenuNode);

router.get("/", authMiddleware, roleMiddleware("ADMIN"), getMenuNodes);

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateMenuNode);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteMenuNode);

module.exports = router;
