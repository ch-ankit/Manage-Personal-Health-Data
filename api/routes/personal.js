var express = require("express");
var router = express.Router();
var personalDataController = require("./../controller/personalDataController");
router
  .route("/requesteddocument")
  .get(personalDataController.requestedDocument);

router.route("/notifications").get(personalDataController.notifications);
router.route("/friendlist").get(personalDataController.friendList);
router.route("/update").post(personalDataController.updatePersonalData);
router.route("/checkPassword").post(personalDataController.checkPassword);


module.exports = router;
