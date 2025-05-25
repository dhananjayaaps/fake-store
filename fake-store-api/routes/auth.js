const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const verifyToken = require('../middleware/verifyToken');

router.post("/login", auth.login);
router.get("/verify", verifyToken, auth.verifyToken);

module.exports = router;
