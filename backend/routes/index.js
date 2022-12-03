var express = require('express');
var router = express.Router();

var { auth } = require('../middlewares/auth');

/* GET home page. */
router.get('', auth, function(req, res, next) {
  res.json({
    type: "success",
    message: "authentic"
  });
});

module.exports = router;
