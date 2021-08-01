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
        returnData.name = `${nameObj.prefix}.${nameObj.given[0]} ${
          nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
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
  var query = `MATCH(n:Patient{value:$patientId})-[r:medicalRecord]->(m:masterIdentifier)
               MATCH(n1:Practitioner{value:$doctorId})-[r1:hasAcess]->(m)
               RETURN n.value,n1.value,m.value,r1.terminated,r1.timeStamp,r1.sharedDate ORDER BY r1.timeStamp-toInteger(r1.accessTime) DESC limit 20
              `;
  session
    .run(query, {
      patientId: req.query.patientId,
      doctorId: req.query.doctorId,
    })
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.pateintId = el._fields[0];
        returnData.doctorId = el._fields[1];
        returnData.documentId = el._fields[2];
        returnData.terminationStatus = el._fields[3].low;
        returnData.timeStamp = el._fields[4];
        returnData.sharedDate = el._fields[5];
        return returnData;
      });
      return data;
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => next(err));
};
