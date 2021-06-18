var express = require("express");
var router = express.Router();
var signupController = require("./../controller/signupController");

router
  .route("/")
  .post(signupController.setPasswordPatient)
  .patch(signupController.changePasswordPatient);

router
  .route("/doctor")
  .post(signupController.setPasswordDoctor)
  .patch(signupController.changePasswordDoctor);

module.exports = router;
