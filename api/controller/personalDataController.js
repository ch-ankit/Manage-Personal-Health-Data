const driver = require("./../database");

exports.getContact = async (req, res, next) => {
  const session = driver.session();
  const query = `MATCH(n:Patient{value:"${req.query.id}"})-[r:contact]->(m:relationship)-[:coding]->(:coding)
  MATCH(m)-[r1:name]->(m1:telecom)
  MATCH(m)-[r2:address]->(m2:organiztion) return r.gender,m.text,r1.given,r1.family,m1.value,r2.text,r2.postalCode,r2.line,m2.display`;
  session
    .run(query)
    .then((result) => {
      if (result.records[0]) {
        var data = result.records.map((el) => {
          var returnData = {};
          returnData.gender = el._fields[0];
          returnData.text = el._fields[1];
          returnData.given = el._fields[2];
          returnData.family = el._fields[3];
          returnData.contactNo = el._fields[4];
          returnData.text = el._fields[5];
          returnData.postalCode = el._fields[6];
          returnData.line = el._fields[7];
          returnData.display = el._fields[8];
          return returnData;
        });
        return data;
      } else {
        return { message: "emergency contact not added" };
      }
    })
    .then((data) => res.send(data))
    .catch((err) => next(err));
};

exports.addContact = async (req, res, next) => {
  params = {
    relationship: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v2-0131",
            code: "E",
          },
        ],
        text: req.body.relationship,
      },
    ],
    name: {
      use: "official",
      family: req.body.lastName,
      given: [req.body.firstName, req.body.middleName],
    },
    telecom: [
      {
        system: "phone",
        value: req.body.phoneNo,
        use: "mobile",
        rank: 1,
      },
    ],
    address: {
      use: "home",
      type: "postal/physical/both",
      text: `${
        (req.body.city, req.body.district, req.body.state, req.body.country)
      }`,
      line: req.body.streetName,
      city: req.body.city,
      district: req.body.district,
      state: req.body.state,
      country: req.body.country,
      postalCode: req.body.postalCode,
    },
    gender: req.body.gender,
    organization: {
      reference: "Organization",
      display: req.body.workplace,
    },
  };
  const session = driver.session();
  const query = `MATCH(n:Patient{value:"${req.body.id}"})
                 MERGE(n)-[:contact{gender:$gender}]->(m:relationship{text:$relationship[0].text})-[:coding]->(:coding{system:$relationship[0].coding[0].system,code:$relationship[0].coding[0].code})
                 MERGE(m)-[:name{use:$name.use,given:$name.given,family:$name.family}]->(:telecom{system:$telecom[0].system,use:$telecom[0].use,value:$telecom[0].value,rank:$telecom[0].rank})
                 MERGE(m)-[:address{ use:$address.use,type:$address.type,text:$address.text,line:$address.line,city:$address.city,district:$address.district,country:$address.country,state:$address.state,postalCode:$address.postalCode}]->(:organiztion{reference:$organization.reference,display:$organization.display})
                  `;
  session
    .run(query, params)
    .then(() => {
      res.send({ message: "contact added sucessfully" });
    })
    .catch((err) => console.log(err));
};

exports.requestedDocument = async (req, res, next) => {
  var session = session.driver();
  var query = `MATCH(n:Patient{value:$patientId}-[:medicalRecord]->(m:masterIdentifier{})-[:content]->(o)
               MATCH(n1:Practitioner)-[r2:hasName]->(m2)
               MATCH(n1)-[:photo]->(m3)
               MATCH(n1)-[r3:hasRequested]->(m)
               WHERE r3.status="pending"
               RETURN n1.value,m.value,o.title,r3.Date,m2,m3.url
              `;
  var params = {
    patientId: req.query.patientId,
  };
  session
    .run(query, params)
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.doctortId = el._fields[0];
        returnData.mastertId = el._fields[1];
        returnData.title = el._fields[2];
        returnData.requestedDate = el._fields[3];
        returnData.photo = el._fields[5];
        var nameObj = el._fields[4].properties;
        returnData.doctorName = `${nameObj.prefix}.${nameObj.given[0]} ${
          nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
        }${nameObj.family}${nameObj.suffix == "" ? "" : `,${nameObj.suffix}`}`;
        return returnData;
      });
      return data;
    })
    .then((data) => res.send(data))
    .catch((err) => next(err));
};

exports.notifications = async (req, res, next) => {
  var session = driver.session();
  session
    .run(
      `MATCH (n:Patient{value:"${req.body.patientId}"})-[r:hasNotification{}]->(m:notificaton)
       RETUrN r.viewed,m.doctorId,m.status,m.doctorName
      `
    )
    .then((result) => {
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.viewed = el._fields[0];
        returnData.doctortId = el._fields[1];
        returnData.status = el._fields[2];
        var nameObj = el._fields[3].properties;
        returnData.doctorName = `${nameObj.prefix}.${nameObj.given[0]} ${
          nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
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

exports.giveAcess = async (req, res, next) => {
  var session = session.driver();
  var query;
  if (req.body.status == "granted") {
    query = `MATCH(n:Patient{value:$patientId}-[:medicalRecord]->(m:masterIdentifier{value:$masterId})
               MATCH(n1:Practitioner{value:$doctorId})
               MATCH(n1)-[r3:hasRequested]->(m)
               MATCH(n1)-[r4:hasAcess]->(m)
               SET r3.status="granted,r4.terminated=0,r4.timeStamp=${
                 Date.now() + accessTime
               }
              `;
  } else {
    query = `MATCH(n:Patient{value:$patientId}-[:medicalRecord]->(m:masterIdentifier{value:$masterId})
               MATCH(n1:Practitioner{value:$doctorId})
               MATCH(n1)-[r3:hasRequested]->(m)
               SET r3.status="rejected"
              `;
  }
  var params = {
    patientId: req.body.patientId,
    doctorId: req.body.doctorId,
    acessTime: req.body.acessTime,
    masterId: req.body.masterId,
  };
  session
    .run(query, params)
    .then(() => res.send({ message: "acess re-granted" }))
    .catch((err) => next(err));
};

exports.updatePersonalData = async (req, res, next) => {
  var session = driver.session();
  const params = {
    identifierValue: req.body.patientId,
    nameFamily: `${req.body.lastName}`,
    given: [`${req.body.firstName}`, `${req.body.middleName}`],
    prefix: `${req.body.prefix}`,
    suffix: `${req.body.suffix}`,
    telecom1Value: `${req.body.mobileNo}`,
    gender: `${req.body.gender}`,
    birthDate: `${req.body.dob}`,
    addressText: `${req.body.city},${req.body.district},${req.body.state},${req.body.country}`,
    city: `${req.body.city}`,
    district: `${req.body.district}`,
    state: `${req.body.state}`,
    country: `${req.body.country}`,
    line: [`${req.body.houseNo}`, `${req.body.streetName}`],
    postalCode: `${req.body.postalCode}`,
    maritalStatusCodingCode: `${req.body.maritialStatusCode}`,
    maritalStatustext: `${req.body.maritialStatus}`,
    multipleBirthBoolean: req.body.multipleBirthBoolean === "true",
    multipleBirthInteger: parseInt(req.body.birthOrder),
    photoUrl: `${req.body.photo}`,
    photoCreation: Date(),
    communicationLanguageCodingCode: `${req.body.languageCode}`,
    communicationLanguagetext: `${req.body.language}`,
  };

  var query = `MATCH(n:Patient{value:$identifierValue})
               MATCH(n)-[r:identifies{}]->(m:patient{})
               MATCH(n)-[r1:hasName{}]->(m1:name{})
               MATCH(n)-[r2:telecom{}]->(m2:phone{})
               MATCH(n)-[r3:address{}]->(m3:addressUse{})
               MATCH(n)-[r4:maritialStatus{}]->(m4:coding{})
               MATCH(n)-[r5:photo]->(m5:photo{})
               MATCH(n)-[r6:communication{}]->(m6:coding{})
               SET m1.family=$nameFamily,given=$given,m1.prefix=$prefix,m1.suffix=$suffix,m2.telecom1Value=$telecom1Value,m.gender=$gender,m.birthDate=$birthDate,m3.text=$addressText,m3.city=$city,m3.district=$district,m3.state=$state,m3.country=$country,m3.line=$line,m3.postalCode=$postalCode,m4.maritalStatusCodingCode=$maritalStatusCodingCode,r4.text=$maritalStatustext,m.multipleBirthBoolean=$multipleBirthBoolean,m.multipleBirthInteger=$multipleBirthInteger,m5.url=$photoUrl,m5.creation=$photoCreation,m6.code=$communicationLanguageCodingCode,r6.text=$communicationLanguagetext`;

  session
    .run(query, params)
    .then(() => {
      res.send({ message: "data updated sucessfuly" });
    })
    .catch((err) => {
      next(err);
    });
};
