const driver = require("./../database");
var path = require("path");

exports.patientKnowsDoctor = async (req, res, next) => {
  var session = driver.session();
  var params = {
    patientId: req.body.patientId,
    doctorId: req.body.doctorId,
  };
  session
    .run(
      `MATCH(n:Patient{value:$patientId})
       MATCH(m:Practitioner{value:$doctorId})
       MERGE(n)-[r:knows{status:"pending",since:"not defined"}]->(m)
      `,
      params
    )
    .then(() => {
      res.send({ message: "Doctor added known list" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.doctorAcceptsPatient = async (req, res, next) => {
  var session = driver.session();
  var query;
  if (req.body.status == "accepted") {
    query = `MATCH (n:Patient{value:"${req.body.patientId
      }"})-[r:knows{}]->(m:Practitioner{value:"${req.body.doctorId
      }"}) SET r.status="accepted",r.since="${Date()}"`;
  } else {
    query = `MATCH (n:Patient{value:"${req.body.patientId}"})-[r:knows{}]->(m:Practitioner{value:"${req.body.doctorId}"}) SET r.status="rejected"`;
  }
  session
    .run(query)
    .then(() => {
      res.send({ message: "Response recorded" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.shareFile = async (req, res, next) => {
  var session = driver.session();
  const io = req.app.get("socketServer");
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
        }${nameObj.family}${nameObj.suffix == "" ? "" : `,${nameObj.suffix}`}`;
      return name;
    })
    .then((name) => {
      var session = driver.session();
      session
        .run(`MATCH (n:Socketuser) return n;`)
        .then((result) => {
          var users = result.records.map((el) => el._fields[0].properties);
          return users;
        })
        .then((users) => {
          var date = new Date();
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var ampm = hours >= 12 ? "pm" : "am";
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? "0" + minutes : minutes;
          var strTime = hours + ":" + minutes + " " + ampm;
          console.log(strTime);
          users = users.filter((el) => req.body.doctorId == el.userId);
          if (users[0]) {
            console.log(users);
            io.to(users[0].socketId).emit("pushNotificationDoctor", {
              doctorId: req.body.doctorId,
              patientName: name,
              time: strTime,
              documentId: req.body.masterId,
            });
            var session = driver.session();
            session
              .run(
                `MATCH(n:Practitioner{value:"${req.body.doctorId}"})
            MERGE(n)-[:hasNotification]->(:notification{doctorId:"${req.body.doctorId}", patientName:"${name}", time:"${strTime}",documentId:"${req.body.masterId}",markAsRead:"false"})`,
                {}
              )
              .then(() => {
                console.log("notification added to database");
              })
              .catch((err) => next(err));
          } else {
            console.log("Sorry Socket id did not match with connected users so backed up to database");
            var session = driver.session();
            session
              .run(
                `MATCH(n:Practitioner{value:"${req.body.doctorId}"})
            MERGE(n)-[:hasNotification]->(:notification{doctorId:"${req.body.doctorId}", patientName:"${name}", time:"${strTime}",documentId:"${req.body.masterId}",markAsRead:"false"})`,
                {}
              )
              .then(() => {
                console.log("notification added to database");
              })
              .catch((err) => next(err));
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

exports.sharedDocuments = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH(n:Patient{value:$patientId})-[r:medicalRecord]->(m:masterIdentifier)<-[s:hasAcess{terminated:0}]-(o:Practitioner)-[t:hasName]->(p:name)
               MATCH(m)-[:content]->(m1:attachment)
               WHERE s.timeStamp>=${Date.now() / 60000}
               RETURN m.value,m1.title,s.sharedDate,p,s.timeStamp,o.value
              `;
  session
    .run(query, {
      patientId: req.query.patientId,
    })
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.masterId = el._fields[0];
        returnData.title = el._fields[1];
        returnData.sharedDate = el._fields[2];
        returnData.timeStamp = el._fields[4];
        returnData.doctorId = el._fields[5];
        var nameObj = el._fields[3].properties;
        returnData.name = `${nameObj.prefix}.${nameObj.given[0]} ${nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
          }${nameObj.family}${nameObj.suffix == "" ? "" : `,${nameObj.suffix}`}`;
        return returnData;
      });
      return data;
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => next(err));
};

exports.sharedDocumentsHistory = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH(n:Patient{value:$patientId})-[r:medicalRecord]->(m:masterIdentifier)<-[s:hasAcess{}]-(o:Practitioner)-[t:hasName]->(p:name)
               MATCH(m)-[:content]->(m1:attachment)
               WHERE s.timeStamp<${Date.now() / 60000} OR r.terminated=1
               RETURN m.value,m1.title,s.sharedDate,p,s.timeStamp,o.value
              `;
  session
    .run(query, {
      patientId: req.query.patientId,
    })
    .then((result) => {
      console.log(result.records.length);
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.masterId = el._fields[0];
        returnData.title = el._fields[1];
        returnData.sharedDate = el._fields[2];
        returnData.timeStamp = el._fields[4];
        returnData.timeStamp = el._fields[5];
        var nameObj = el._fields[3].properties;
        returnData.name = `${nameObj.prefix}.${nameObj.given[0]} ${nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
          }${nameObj.family}${nameObj.suffix == "" ? "" : `,${nameObj.suffix}`}`;
        return returnData;
      });
      return data;
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => next(err));
};

exports.terminateShare = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH(n:Patient{value:$patientId})-[r:medicalRecord]->(m:masterIdentifier{value:$masterId})<-[s:hasAcess{}]-(o:Practitioner{value:$doctorId})-[t:hasName]->(p:name) SET s.terminated=1
   `;
  session
    .run(query, {
      patientId: req.body.id,
      doctorId: req.body.doctorId,
      masterId: req.body.masterId,
    })
    .then(() => {
      res.send({ message: "sharing terminated" });
    })
    .catch((err) => next(err));
};
