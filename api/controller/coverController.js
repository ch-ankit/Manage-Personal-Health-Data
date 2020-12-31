var driver = require("../connection");

//signup for doctor/patient/co-ordinator/director

exports.getHomPage =
  ("/",
  (req, res, next) => {
    var session = driver.session();
    var data = [];
    var label = "hospital";
    var query = `MATCH (n : ${label}) RETURN n`;
    session
      .run(query)
      .then((result) => {
        result.records.forEach((record) => {
          data.push(
            record._fields[0].properties.address,
            record._fields[0].properties.contactNo,
            record._fields[0].properties.email,
            record._fields[0].properties.name,
            record._fields[0].properties.specialization
          );
        });
        res.send({ data: data });
      })
      .catch((error) => {
        next(error);
      })
      .then(() => session.close());
  });
