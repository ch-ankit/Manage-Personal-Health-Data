var express = require("express");
var router = express.Router();
var driver = require("./../connection");

// var query = "MATCH (n:person) RETURN n.name AS name,n.address AS address";
// session
//   .run(query)
//   .then((result) => {
//     result.records.forEach((record) => {
//       // console.log(record.get("name"), record.get("address"));
//       result1.push(record.get("address"));
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .then(() => console.log(result1))
//   .then(() => session.close());

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", huhu: "medical" });
});

module.exports = router;
