var express = require("express");
var router = express.Router();
var lastVisitedController = require("./../controller/lastVisitedController");

router.route("/").get(lastVisitedController.getData);
// .post(lastVisitedController.addReport)
// .patch(lastVisitedController.changeReport);

module.exports = router;
