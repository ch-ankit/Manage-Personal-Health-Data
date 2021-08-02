var express = require("express");
var router = express.Router();
var personalDataController = require("./../controller/personalDataController");
router
  .route("/requestedDocument")
  .get(personalDataController.requestedDocument);

module.exports = router;
