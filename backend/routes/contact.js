var express = require("express");
var router = express.Router();

var contact = require("../controllers/contact");


router.get("", contact.get);
router.post("/add", contact.add);

module.exports = router;