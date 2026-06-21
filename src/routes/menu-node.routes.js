const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { getMyMenu } = require("../controllers/menu-node.controller");

const router = express.Router();

router.get("/my-menu", authMiddleware, getMyMenu);

module.exports = router;
