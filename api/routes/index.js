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

router.post("/login", (req, res, next) => {
  var session = driver.session();
  // var result1 = [];
  var label = "person";
  var query = `MATCH (n:${label} {employeeId : $empId}) RETURN n AS results`;
  session
    .run(query, {
      empId: `${req.body.id}`,
    })
    .then((result) => {
      var result1 = [];
      result.records.forEach((record) => {
        // res.send(record);
        result1.push(
          record._fields[0].properties.name,
          record._fields[0].properties.email,
          record._fields[0].properties.contactNo,
          record._fields[0].properties.address,
          record._fields[0].labels.pop()
        );
      });
      res.send({ data: result1 });
      session.close();
      // console.log(1);
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
