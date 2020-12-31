const { json } = require("express");
var driver = require("./../connection");
var session = driver.session();

//signup for doctor/patient/co-ordinator/director

exports.signup = (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:${req.query.position}{employeeId:$id}) RETURN n.employeeId`;
  session
    .run(query, {
      id: req.body.id,
    })
    .then((result) => {
      if (result.records[0] !== undefined) {
        var message =
          "The Provided Id is Already Registered Check again and Try";
      } else {
        var query = `MERGE (n:person:staff:${req.query.position} {employeeId:${req.body.id},name:${req.body.name},address:${req.body.address},contactNo:${req.body.contactNo},degree:${req.body.degree},email:${req.body.email},jobType:${req.body.jobType}}) -[r:worksAt{since:,authoritylevel:4}]->(m:department{name:${req.body.department}}) `;
        if (req.query.position === patient)
          query = `MERGE (n:person:${req.query.position}) RETURN n.employeeId`;
        session
          .run(query, {})
          .then((result) => {
            result.records.forEach((record) => {});
          })
          .catch((error) => {
            next(error);
          });
        message = "Signup Successfull";
      }
      res.send({ data: message });
    })
    .catch((error) => {
      next(error);
    });
};

//login

exports.login = (req, res, next) => {
  var session = driver.session();
  var label = "person";
  var query = `MATCH (n:${label} {employeeId : $empId}) RETURN n AS results`;
  var result1 = [];
  session
    .run(query, {
      empId: `${req.body.id}`,
    })
    .then((result) => {
      result.records.forEach((record) => {
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
    })
    .catch((err) => {
      next(err);
    });
};
