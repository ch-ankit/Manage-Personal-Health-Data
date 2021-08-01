var express = require("express");
var router = express.Router();
var doctorController = require("./../controller/doctorController");

router.route("/recentpatient").get(doctorController.recentPatient);
router.route("/recentdocuments").get(doctorController.recentDocuments);

module.exports = router;
