var express = require("express");
var router = express.Router();
var shareController = require("./../controller/shareController");

router
  .route("/")
  .post(shareController.shareFile)
  .get(shareController.getSharedFile);

module.exports = router;
