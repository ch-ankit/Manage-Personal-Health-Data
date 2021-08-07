const { session } = require("neo4j-driver");
const driver = require("./../database");

exports.recentPatient = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:Practitioner{value:$doctorId})-[r:hasAcess]->(m),
               (n1:Patient{value:r.patientId})-[r1:hasName]->(m1), 
               (n1)-[r2:photo]->(m2:photo)
               RETURN n1.value,m1,m2.url,r.acessedDate,r.sharedDate ORDER BY r.timeStamp-toInteger(r.accessTime) DESC
                `;
  session
    .run(query, { doctorId: req.query.doctorId })
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.value = el._fields[0];
        returnData.photo = el._fields[2];
        returnData.visitDate = el._fields[3];
        returnData.sharedDate = el._fields[4];
        var nameObj = el._fields[1].properties;
        returnData.name = `${nameObj.prefix}.${nameObj.given[0]} ${nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
          }${nameObj.family}${nameObj.suffix == "" ? "" : `,${nameObj.suffix}`}`;
        return returnData;
      });
      return data;
    })
    .then((data) => {
      var data2 = [];
      console.log(data.length);
      data.forEach((el) => {
        !data2.some((user) => user.value === el.value) && data2.push(el);
      });
      // data2[0] = data[0];
      // for (let i = 1; i < data.length; i++) {
      //   if (data[i].value === data[i - 1].value) {
      //   } else {
      //     data2.push(data[i]);
      //   }
      // }
      res.send(data2);
    })
    .catch((err) => {
      next(err);
    });
};

exports.recentDocuments = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH(n:Patient{value:$patientId})-[r:medicalRecord]->(m:masterIdentifier)-[:content]->(o:attachment)
               MATCH(n1:Practitioner{value:$doctorId})-[r1:hasAcess]->(m)
               RETURN n.value,n1.value,m.value,r1.terminated,r1.timeStamp,r1.sharedDate, o.title ORDER BY r1.timeStamp-toInteger(r1.accessTime) DESC limit 20
              `;
  session
    .run(query, {
      patientId: req.query.patientId,
      doctorId: req.query.doctorId,
    })
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.patientId = el._fields[0];
        returnData.doctorId = el._fields[1];
        returnData.documentId = el._fields[2];
        returnData.terminationStatus = el._fields[3].low;
        returnData.timeStamp = el._fields[4];
        returnData.sharedDate = el._fields[5];
        returnData.title = el._fields[6];
        return returnData;
      });
      return data;
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => next(err));
};

exports.notifications = async (req, res, next) => {
  var session = driver.session();
  session
    .run(
      `MATCH(n:Practitioner{value:"${req.query.doctorId}"})-[:hasNotification]->(m:notification)
      MATCH(n1:Patient{value:m.patientId})-[:photo]->(m1)
      MATCH(n2:masterIdentifier{value:m.documentId})-[:content]->(m2)
      RETURN m.patientName,m.documentId,m.time,m.doctorId,m.markAsRead,m.patientId,m1.url,m2.title`
    )
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.patientName = el._fields[0];
        returnData.documentId = el._fields[1];
        returnData.time = el._fields[2];
        returnData.doctorId = el._fields[3];
        returnData.markAsRead = el._fields[4];
        returnData.patientId = el._fields[5];
        returnData.photo = el._fields[6];
        returnData.title = el._fields[7];
        return returnData;
      });
      return data;
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => next(err));
};

exports.alterNotifications = async (req, res, next) => {
  var session = driver.session();
  session
    .run(
      `MATCH(n:Practitioner{value:"${req.body.doctorId}"})-[:hasNotification]->(m:notification) SET m.markAsRead="true"`
    )
    .then((data) => {
      res.send({ message: "ALL notifications marked as read" });
    })
    .catch((err) => next(err));
};

exports.toAddList = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:Patient{})-[r:knows{}]->(m:Practitioner{value:"${req.query.doctorId}"})
               MATCH(n)-[r1:hasName]->(m1)
               MATCH(n)-[r2:photo]->(m2:photo)
               WHERE r.status="pending" RETURN n.value,m1,m2.url
               `;
  session
    .run(query, {})
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.patientId = el._fields[0];
        returnData.photo = el._fields[2];
        var nameObj = el._fields[1].properties;
        returnData.name = `${nameObj.prefix}.${nameObj.given[0]} ${nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
          }${nameObj.family}${nameObj.suffix == "" ? "" : `,${nameObj.suffix}`}`;
        return returnData;
      });
      return data;
    })
    .then((data) => res.send(data))
    .catch((err) => {
      next(err);
    });
};

exports.addPatient = async (req, res, next) => {
  var session = driver.session();
  const io = req.app.get("socketServer");
  var query = `MATCH (n:Patient{value:"${req.body.patientId}"})-[r:knows{}]->(m:Practitioner{value:"${req.body.doctorId}"})
               SET r.status="${req.body.status}", r.since="${Date()}"
               `;
  session
    .run(query, {})
    .then(() => {
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
          users = users.filter((el) => req.body.patientId == el.userId);
          if (users[0]) {
            console.log(users);
            io.to(users[0].socketId).emit("pushNotsPatientFriendAccept", {
              doctorId: req.body.doctorId,
              name: `Dr. ${req.body.firstName} ${req.body.lastName}`,
              time: strTime,
              photo: req.body
            });
            var session = driver.session();
            session
              .run(
                `MATCH(n:Patient{value:"${req.body.patientId}"})
            MERGE(n)-[:hasNotification]->(:notification{doctorId:"${req.body.doctorId}",doctorName:"${`Dr. ${req.body.firstName} ${req.body.lastName}`}",time:"${strTime}", viewed:"false"})`,
                {}
              )
              .then(() => {
                console.log("Friend request accepted and updated to database");
              })
              .catch((err) => next(err));
          } else {
            console.log(
              "Sorry Socket id did not match with connected users so backed up to database"
            );
            var session = driver.session();
            session
              .run(
                `MATCH(n:Patient{value:"${req.body.patientId}"})
                MERGE(n)-[:hasNotification]->(:notification{doctorId:"${req.body.doctorId}",doctorName:"${`Dr. ${req.body.firstName} ${req.body.lastName}`}",time:"${strTime}", viewed:"false"})`,
                {}
              )
              .then(() => {
                console.log("Friend request accepted and updated to database");
              })
              .catch((err) => next(err));
          }
        })
        .catch((err) => console.log(err))
      res.send({ message: "Patient Added to known list" })
    })
    .catch((err) => {
      next(err);
    });
};

exports.requestDocument = async (req, res, next) => {
  var session = driver.session();
  const io = req.app.get("socketServer");
  var query = `MATCH(n:Patient{value:$patientId})-[:medicalRecord]->(m:masterIdentifier{value:$masterId})
               MATCH(n1:Practitioner{value:$doctorId})-[r1:hasAcess]->(m) WHERE r1.terminated=1 OR r1.timeStamp<${Date.now() / 60000
    }
               MERGE(n1)-[:hasRequested{masterId:$masterId,requestedTime:"${Date()}",status:"pending"}]->(m)
              `;
  var params = {
    patientId: req.body.patientId,
    masterId: req.body.masterId,
    doctorId: req.body.doctorId,
  };
  session
    .run(query, params)
    .then(() => res.send({ message: "Request Added" }))
    .catch((err) => next(err));
};
