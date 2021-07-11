var express = require("express");
var router = express.Router();
var searchController = require("./../controller/searchController");

router.route("/").get(searchController.getSearchedData);
// .post(searchController.addReport)
// .patch(searchController.changeReport);

module.exports = router;
