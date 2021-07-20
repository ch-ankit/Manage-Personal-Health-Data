const driver = require("./../database");

exports.getSearchedData = async (req, res, next) => {
  console.log(req.query.patientId);
  var query = `MATCH(n:Patient{value:"${req.query.patientId}"})-[r:medicalRecord]->(m:masterIdentifier)-[r1:custodian]->(m1)
  MATCH(m)-[:content]->(m2:attachment) 
  MATCH(m)-[:context]->(m3)-[r2:event]->(m4:coding)
  MATCH(m)-[:category]->(m5:coding)
  MATCH(m)-[:hasSymptoms]->(m6:symptoms)
  MATCH(m)-[:prescriptions{}]->(m7:prescriptions)
  RETURN m.value,r.date,r1.display,m2.title,m4.display,m5.display,m6.symptoms,m7.prescriptions`;
  var session = driver.session();
  session
    .run(query)
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.filename = el._fields[0];
        returnData.date = el._fields[1];
        returnData.hospitalName = el._fields[2];
        returnData.reportTitle = el._fields[3];
        returnData.bodyPart = el._fields[4];
        returnData.category = el._fields[5];
        returnData.symptoms = el._fields[6];
        returnData.prescriptions = el._fields[7];
        return returnData;
      });
      return data;
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => next(err));
};

exports.getPrescriptions = async (req, res, next) => {
  var query = `MATCH(n:Patient{value:"${req.query.patientId}"})-[r:medicalRecord]->(m:masterIdentifier)-[:prescriptions{}]->(m7:prescriptions)
  RETURN m.value,r.date,m7.prescriptions`;
  var session = driver.session();
  session
    .run(query)
    .then((result) => {
      console.log(result.records.length);
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.filename = el._fields[0];
        returnData.date = el._fields[1];
        returnData.prescriptions = el._fields[2];
        return returnData;
      });
      // console.log(data);
      res.send(data);
    })
    .catch((err) => next(err));
};

// req = {
//   query: {
//     patientId: "20000101-857026",
//   },
// };
// res = {
//   send: (x) => {
//     console.log(x);
//   },
// };
// function next(x) {
//   console.log(x);
// }
// getPrescriptions(req, res, next);