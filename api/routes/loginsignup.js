var express = require("express");
var router = express.Router();
var signupController = require("./../controller/signupController");

/* GET home controller. */
router.post("/login", signupController.login);
router.post("/signup", signupController.signup);

module.exports = router;
