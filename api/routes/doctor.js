var express = require("express");
var router = express.Router();
var doctorController = require("../controller/doctorController");

router.route("/recentpatient").get(doctorController.recentPatient);
router.route("/recentdocuments").get(doctorController.recentDocuments);
router.route("/getnotification").get(doctorController.notifications);

module.exports = router;
