var express = require("express");
var router = express.Router();
var doctorController = require("../controller/doctorController");

router.route("/recentpatient").get(doctorController.recentPatient);
router.route("/recentdocuments").get(doctorController.recentDocuments);
router.route("/getnotification").get(doctorController.notifications);
router
  .route("/addlist")
  .get(doctorController.toAddList)
  .post(doctorController.addPatient);
router.route("/requestdocument").post(doctorController.requestDocument);

module.exports = router;
