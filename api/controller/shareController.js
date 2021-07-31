const driver = require("./../database");
var path = require("path");

exports.shareFile = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:Patient{value:$patientId})-[r:medicalRecord{}]->(m:masterIdentifier{value:$masterId})
                MATCH(n1:Practitioner{value:$doctorId})
                MERGE(n1)-[r2:hasAcess{recordId:m.value,patientId:n.value,timeStamp:${(
                  Date.now() / 60000 +
                  parseInt(req.body.accessTime)
                ).toString()},acessedDate:"${Date()}",accessTime:"${
    req.body.accessTime
  }",terminated:0}]->(m)
                return n.value,r.value,m.value,r2.timeStamp,r2.acessedDate
                `;
  session
    .run(query, {
      patientId: req.body.id,
      doctorId: req.body.doctorId,
      masterId: req.body.masterId,
    })
    .then((result) => {
      console.log(Date.now() / 60000, result.records[0]._fields[3]);
      res.send({
        message: "access granted",
      });
    })
    .catch((err) => next(err));
};

exports.getSharedFile = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:Patient{value:$patientId})-[r:medicalRecord{}]->(m:masterIdentifier{value:$masterId})
               MATCH(n1:Practitioner{value:$doctorId})
               MATCH(n1)-[r2:hasAcess{}]->(m)
               WHERE r2.timeStamp>${Date.now() / 60000} AND r2.terminated = 0
               return n.value,m.value,n1.value,r2.timeStamp
              `;
  session
    .run(query, {
      patientId: req.query.id,
      doctorId: req.query.doctorId,
      masterId: req.query.masterId,
    })
    .then((result) => {
      if (result.records[0] != undefined) {
        console.log(result.records);
        res.send({
          message: `${result.records[0]._fields[2]} has  access to ${
            result.records[0]._fields[0]
          }'s document: ${result.records[0]._fields[1]} for ${
            result.records[0]._fields[3] - Date.now() / 60000
          }`,
        });
      } else {
        res.send({
          message: `access has not been granted or has been provokeds `,
        });
      }
    })
    .catch((err) => next(err));
};
