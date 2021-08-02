var express = require("express");
var router = express.Router();
var shareController = require("./../controller/shareController");

router
  .route("/")
  .post(shareController.shareFile)
  .get(shareController.getSharedFile);

router.route("/recentdocuments").get(shareController.sharedDocuments);

router
  .route("/recentdocumentshistory")
  .get(shareController.sharedDocumentsHistory);

router.route("/terminate").post(shareController.terminateShare);

module.exports = router;
