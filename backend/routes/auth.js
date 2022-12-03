var express = require('express');
var router = express.Router();

var auth = require("../controllers/auth");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/logout", auth.logout);

module.exports = router;