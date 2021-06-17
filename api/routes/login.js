var express = require("express");
var router = express.Router();
var signupController = require("./../controller/signupController");

router.post("/patient", signupController.patientLogin);
router.post("/doctor", signupController.doctorLogin);

module.exports = router;
