const driver = require("./../database");
var path = require("path");

exports.shareFile = async (req, res, next) => {
  var session = driver.session();
  const io = req.app.get('socketServer')
  // console.log(io)
  var query = `MATCH (n:Patient{value:$patientId})-[r:medicalRecord{}]->(m:masterIdentifier{value:$masterId})
               MATCH(n)-[r1:hasName]->(m1:name)              
               MATCH(n2:Practitioner{value:$doctorId})
               MERGE(n2)-[r2:hasAcess{recordId:m.value,patientId:n.value,timeStamp:${(
      Date.now() / 60000 +
      parseInt(req.body.accessTime)
    ).toString()},sharedDate:"${Date()}",accessTime:"${req.body.accessTime
    }",terminated:0,accessedDate:""}]->(m)
                return n.value,r.value,m.value,r2.timeStamp,r2.acessedDate,m1
                `;
  session
    .run(query, {
      patientId: req.body.id,
      doctorId: req.body.doctorId,
      masterId: req.body.masterId,
    })
    .then((result) => {
      var nameObj = result.records[0]._fields[5].properties;
      var name = `${nameObj.prefix}.${nameObj.given[0]} ${nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
        }${nameObj.family}${nameObj.suffix == "" ? "" : `,${nameObj.suffix}`
        }`;
      return name

    }).then((name) => {
      var session = driver.session();
      session
        .run(`MATCH (n:Socketuser) return n;`)
        .then((result) => {
          var users = result.records.map(el => el._fields[0].properties)
          return users
        }).then((users) => {
          users = users.filter(el => req.body.doctorId == el.userId)
          if (users[0]) {
            console.log(users)
            io.to(users[0].socketId).emit('pushNotificationDoctor', ({ doctorId: req.body.doctorId, patientName: name }))
          } else {
            console.log('Sorry Socket id did not match with connected users')
          }
        })
        .catch((err) => console.log(err));
      res.send({
        message: "access granted",
      });
    })
    .catch((err) => console.log(err));
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
        var session = driver.session();
        session
          .run(
            `MATCH (n:Patient{value:$patientId})-[r:medicalRecord{}]->(m:masterIdentifier{value:$masterId})
                     MATCH(n1:Practitioner{value:$doctorId})
                     MATCH(n1)-[r2:hasAcess{}]->(m)
                     SET r2.accessedDate = "${Date()}"
                     return r2
                     `,
            {
              patientId: result.records[0]._fields[0],
              masterId: result.records[0]._fields[1],
              doctorId: result.records[0]._fields[2],
            }
          )
          .then()
          .catch((err) => next(err));
        res.send({
          message: `${result.records[0]._fields[2]} has  access to ${result.records[0]._fields[0]
            }'s document: ${result.records[0]._fields[1]} for ${result.records[0]._fields[3] - Date.now() / 60000
            }`,
        });
      } else {
        res.send({
          message: `access has not been granted or has been provoked `,
        });
      }
    })
    .catch((err) => next(err));
};
