var express = require("express");
var router = express.Router();
var personalDataController = require("./../controller/personalDataController");
router
  .route("/requestedDocument")
  .get(personalDataController.requestedDocument);

router.route("/notifications").get(personalDataController.notifications);

module.exports = router;