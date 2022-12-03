var express = require("express");
var router = express.Router();

var message = require("../controllers/message");

router.post("/get", message.get);

module.exports = router;