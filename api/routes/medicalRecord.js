var express = require("express");
var router = express.Router();
var medicalRecordController = require("./../controller/medicalRecordController");

router
  .route("/")
  .get(medicalRecordController.getRecord)
  .post(medicalRecordController.addRecord);

module.exports = router;
