var express = require("express");
var router = express.Router();
var homeController = require("../controller/coverController");

/* GET home controller. */
router.get("/", homeController.getHomPage);

module.exports = router;
