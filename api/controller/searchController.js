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
      res.send(result.records[0]._fields);
    })
    .catch((err) => next(err));
};
