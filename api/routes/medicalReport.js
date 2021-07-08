var express = require("express");
var router = express.Router();
var medicalReportController = require("./../controller/medicalReportController");

router
  .route("/")
  .get(medicalReportController.getReport)
  .post(medicalReportController.addReport)
  .patch(medicalReportController.changeReport);

module.exports = router;
