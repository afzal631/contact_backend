const express = require("express");
const router = express.Router();

const {
  registration,
  login,
  current,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/registration", registration);
router.post("/login", login);
router.post("/current", validateToken, current);

module.exports = router;
