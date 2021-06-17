const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var path = require("path");
const fs = require("fs");

var driver = require("./../database");
var sendMail = require("./../nodemailer");
const { json } = require("express");

var checker = async (label, email, next) => {
  try {
    var session = driver.session();
    var query = `MATCH (n:${label}{email:$email}) RETURN n.email`;
    var params = {
      label: label,
      email: email,
    };
    var al = await session.run(query, params);
    return al.records[0];
  } catch (err) {
    next(err);
  }
};

var uniqueId = async (dob, label, next) => {
  var session = driver.session();
  var dob = dob.split("-").join("");
  var id = `${dob}-${10 + Math.floor(Math.random() * 89)}${
    10 + Math.floor(Math.random() * 89)
  }${10 + Math.floor(Math.random() * 89)}`;
  console.log(id);
  var query = `MATCH (n:${label}{value:$value}) RETURN n.value`;
  var params = {
    label: label,
    value: id,
  };
  var al = await session.run(query, params);
  if (!al.records[0]) {
    console.log(id);
    var session = driver.session();
    var params1 = {
      identifierUse: `official`,
      identifierCodingSystem: `https://terminology.hl7.org/2.1.0/CodeSystem-v2-0203.html`,
      identifierCodingCode: `DOB-Random(000000-999999)`,
      identifierSystem: `localhost:3000/static/uniquecodegeneration`,
      value: id,
      lable: label,
    };
    session
      .run(
        `CREATE (n:${label}{
                identifierUse:$identifierUse,
                identifierCodingSystem:$identifierCodingSystem,
                identifierCodingCode:$identifierCodingCode,
                identifierSystem:$identifierSystem,
                value:$value
                })`,
        params1
      )
      .catch((err) => {
        next(err);
      });
    return id;
  } else {
    uniqueId(dob, label);
  }
};

exports.patientSignup = async (req, res, next) => {
  var x = await checker("Patient", `${req.body.email}`, next);
  x = x === undefined ? false : true;
  if (!x) {
    var session = driver.session();
    var id = await uniqueId(`${req.body.dob}`, "Patient", next);
    const params = {
      resourceType: `Patient`,
      identifierValue: `${id}`,
      active: true,
      nameUse: `official`,
      nameFamily: `${req.body.lastName}`,
      given: [`${req.body.firstName}`, `${req.body.middleName}`],
      prefix: `${req.body.prefix}`,
      suffix: `${req.body.suffix}`,
      telecom1System: `phone`,
      telecom1Value: `${req.body.mobileNo}`,
      telecom1Use: `mobile`,
      telecom1rank: 1,
      telecom2System: `email`,
      telecom2Value: `${req.body.email}`,
      telecom2Use: `${
        req.body.email.includes("@gmail.com") ? "personal" : "work"
      }`,
      telecom2rank: 2,
      gender: `${req.body.gender}`,
      birthDate: `${req.body.dob}`,
      deceasedBoolean: false,
      addressUse: `home`,
      addressType: `both`,
      addressText: `${req.body.city},${req.body.district},${req.body.state},${req.body.country}`,
      city: `${req.body.city}`,
      district: `${req.body.district}`,
      state: `${req.body.state}`,
      country: `${req.body.country}`,
      line: [`${req.body.houseNo}`, `${req.body.streetName}`],
      postalCode: `${req.body.postalCode}`,
      maritalStatusCodingSystem: `https://www.hl7.org/fhir/valueset-marital-status.html`,
      maritalStatusCodingCode: `${req.body.maritialStatusCode}`,
      maritalStatustext: `${req.body.maritialStatus}`,
      multipleBirthBoolean: req.body.multipleBirthBoolean === "true",
      multipleBirthInteger: parseInt(req.body.birthOrder),
      photoContentType: "image/*",
      photoUrl: `${req.body.photo}`,
      photoCreation: Date(),
      communicationLanguageCodingSystem:
        "https://www.hl7.org/fhir/valueset-languages.html",
      communicationLanguageCodingCode: `${req.body.languageCode}`,
      communicationLanguagetext: `${req.body.language}`,
      communicationprefered: true,
    };
    var query = `MATCH(n:Patient{value:$identifierValue})
            MERGE(n)-[:identifies{}]->(m:patient{resourceType:$resourceType,active:$active,gender:$gender,birthDate:$birthDate,deceasedBoolean:$deceasedBoolean,multipleBirthBoolean:$multipleBirthBoolean,multipleBirthInteger:$multipleBirthInteger})
            MERGE(n)-[a:hasName{use:$nameUse}]->(o:name{given:$given,family:$nameFamily,prefix:$prefix,suffix:$suffix})
            MERGE(n)-[:telecom{system:$telecom1System}]->(q:phone{use:$telecom1Use,value:$telecom1Value,rank:$telecom1rank})
            MERGE(n)-[:telecom{system:$telecom2System}]->(q1:phone{use:$telecom2Use,value:$telecom2Value,rank:$telecom2rank})
            MERGE(n)-[:address{use:$addressUse}]->(r:addressUse{type:$addressType,text:$addressText,line:$line,city:$city,district:$district,country:$country,state:$state,postalCode:$postalCode})
            MERGE(n)-[:maritialStatus{text:$maritalStatustext}]->(:coding{code:$maritalStatusCodingCode,system:$maritalStatusCodingSystem})
            MERGE(n)-[:photo]->(:photo{contentType:$photoContentType,url:$photoUrl,creation:$photoCreation})
            MERGE(n)-[:communication{preferred:$communicationprefered,text:$communicationLanguagetext}]->(:coding{system:$communicationLanguageCodingSystem,code:$communicationLanguageCodingCode})`;

    session
      .run(query, params)
      .then((result) => {
        var returnValue = {
          email: `${req.body.email}`,
          id: id,
        };
        res.send({
          message:
            "Signup successfull, Login Credentials will be forwarded to you through registered email",
        });
        return returnValue;
      })
      .then((returnValue) => {
        console.log(returnValue);
        var mailBody = `<h3>Thank You For Registering with MPHD</h3><br><p>Your login user id is :</p><br><p>Username:${returnValue.id}</p><h5>Procseed to following link for setting your password: http://localhost:7000/passwordSet</h5>`;
        sendMail.sendMail(`${returnValue.email}`, mailBody, next);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.send({ message: "email is aready registered" });
  }
};

exports.doctorSignup = async (req, res, next) => {
  var x = await checker("doctor", `${req.body.email}`, next);
  x = x === undefined ? false : true;
  if (!x) {
    var session = driver.session();
    const params = {
      address: `${req.body.address}`,
      contactInfo: `${req.body.contactInfo}`,
      dob: `${req.body.dob}`,
      email: `${req.body.email}`,
      gender: `${req.body.gender}`,
      language: `${req.body.language}`,
      name: `${req.body.name}`,
      zipCode: `${req.body.zipCode}`,
      photo: `${req.body.photo}`,
      qualification: `${req.body.qualification}`,
    };
    var query = `MERGE (n:people:doctor{
        address:$address,
        contactInfo:$contactInfo,
        dob:$dob,
        email:$email,
        gender:$gender,
        language:$language,
        name:$name,
        zipCode:$zipCode,
        photo:$photo,
        qualification:$qualification
    }) `;

    session
      .run(query, params)
      .then(() => {
        var returnValue = {
          email: `${req.body.email}`,
          id: `${req.body.dob}` + `${req.body.zipCode}`,
        };
        res.send({
          message:
            "Signup successfull, Login Credentials will be forwarded to you through registered email",
        });
        return returnValue;
      })
      .then((returnValue) => {
        console.log(returnValue);
        var query = `MATCH (n:doctor{email:$email}) SET n.id = $id`;
        session.run(query, returnValue).catch((err) => next(err));
        var mailBody = `<h3>Thank You For Registering with MPHD</h3><br><p>Your login user id is :</p><br><p>Username:${returnValue.id}</p><h5>Procseed to following link for setting your password: http://localhost:7000/home</h5>`;
        sendMail.sendMail(`${returnValue.email}`, mailBody, next);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.send({ message: "email is aready registered" });
  }
};

// exports.patientLogin = async (req, res, next) => {
//   console.log(req.body);
//   var session = driver.session();
//   console.log(req.body.id);
//   var query = `MATCH (n:Patient{value:"${req.body.id}"}) -[:identifies{}]->(m:patient) MATCH (n)-[r:hasName{}]->(m1:name) MATCH(n)-[r1:telecom]->(m2) return n,m,r,m1,r1,m2`;
//   session
//     .run(query)
//     .then(async (result) => {
//       if (result.records[0] !== undefined) {
//         let passwordMatched = await bcrypt.compare(
//           req.body.password,
//           result.records[0]._fields[0].properties.password
//         );
//         if (!passwordMatched) {
//           res.send("USERNAME OR PASSWORD NOT CORRECT");
//         } else {
//           let token = jwt.sign(
//             { email: req.body.email },
//             process.env.TOKEN_SECRET,
//             { expiresIn: 86400 }
//           );

//           var data = Object.keys(result.records).map(
//             (el) => result.records[el]._fields[0].properties
//           );
//           // var data1 = result.records[0]._fields[1].properties;

//           // var data2 = Object.keys(result.records).map(
//           //   (el) => result.records[el]._fields[2].properties
//           // );
//           // var data3 = Object.keys(result.records).map(
//           //   (el) => result.records[el]._fields[3].properties
//           // );
//           // var data4 = Object.keys(result.records).map(
//           //   (el) => result.records[el]._fields[4].properties
//           // );
//           // var data5 = Object.keys(result.records).map(
//           //   (el) => result.records[el]._fields[5].properties
//           // );

//           var data = await comparer(data);
//           // data2 = await comparer(data2);
//           // data3 = await comparer(data3);
//           // data4 = await comparer(data4);
//           // data5 = await comparer(data5);
//           function comparer(x) {
//             console.log(x.length);
//             // var obj1key = Object.keys(x[x.length - 1])[0];
//             // var obj2key = Object.keys(x[x.length - 2])[0];
//             if (
//               JSON.stringify(x[x.length - 1]) ===
//               JSON.stringify(x[x.length - 2])
//             ) {
//               x.pop();
//               console.log("hi from if");
//               comparer(x);
//             } else {
//               console.log(x);
//               return x;
//             }
//           }
//           console.log(data);
//           // console.log(data5);
//           // for (var i = 0; i < data4.length; i++) {
//           //   data5[i].system = data4[i].system;
//           // }

//           var patient = {};
//           patient.identifier = [
//             {
//               use: data[0].use,
//               type: {
//                 coding: [
//                   {
//                     system: data[0].identifierCodingSystem,
//                     code: data[0].identifierCodingCode,
//                   },
//                 ],
//               },
//               system: data[0].System,
//               value: data[0].value,
//             },
//           ];
//           // patient = { ...patient, ...data1 };
//           // patient.name = [data3];
//           // patient.name[0] = { ...patient.name[0], ...data2 };
//           // patient.telecom = data5;

//           patient.token = token;
//           res.send({ patient });
//         }
//       } else {
//         res.send({ message: "Unregistered Username" });
//       }
//     })
//     .catch((err) => next(err));
// };

exports.patientLogin = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:Patient{value:"${req.body.id}"}) return n`;
  session
    .run(query)
    .then(async (result) => {
      if (result.records[0] !== undefined) {
        let passwordMatched = await bcrypt.compare(
          req.body.password,
          result.records[0]._fields[0].properties.password
        );
        if (!passwordMatched) {
          res.send("USERNAME OR PASSWORD NOT CORRECT");
        } else {
          let token = jwt.sign({ id: req.body.id }, process.env.TOKEN_SECRET, {
            expiresIn: 86400,
          });
          var data = result.records[0]._fields[0].properties;
          var patient = {};
          patient.identifier = [
            {
              use: data.identifierUse,
              type: {
                coding: [
                  {
                    system: data.identifierCodingSystem,
                    code: data.identifierCodingCode,
                  },
                ],
              },
              system: data.identifierSystem,
              value: data.value,
            },
          ];
          patient.token = token;
          session.close();
          return patient;
        }
      } else {
        res.send({ message: "Unregistered Username" });
      }
    })
    .then((patient) => {
      var query = `MATCH (n:Patient{value:"${req.body.id}"}) -[:identifies{}]->(m:patient) return m`;
      var params = {};
      var session = driver.session();
      session
        .run(query, params)
        .then((result) => {
          patient = { ...patient, ...result.records[0]._fields[0].properties };
          session.close();
          return patient;
        })
        .then((patient) => {
          var query = `MATCH (n:Patient{value:"${req.body.id}"})-[r:hasName{}]->(m:name) return r,m `;
          var params = {};
          var session = driver.session();
          session
            .run(query, params)
            .then((result) => {
              var data = Object.keys(result.records).map(
                (el) => result.records[el]._fields[0].properties
              );
              var data1 = Object.keys(result.records).map(
                (el) => result.records[el]._fields[1].properties
              );
              for (var i = 0; i < data.length; i++) {
                data1[i].use = data[i].use;
              }
              patient.name = data1;
              session.close();
              return patient;
            })
            .then((patient) => {
              var query = `MATCH (n:Patient{value:"${req.body.id}"})-[r:telecom{}]->(m) return r,m `;
              var params = {};
              var session = driver.session();
              session
                .run(query, params)
                .then((result) => {
                  var data = Object.keys(result.records).map(
                    (el) => result.records[el]._fields[0].properties
                  );
                  var data1 = Object.keys(result.records).map(
                    (el) => result.records[el]._fields[1].properties
                  );
                  for (var i = 0; i < data.length; i++) {
                    data1[i].system = data[i].system;
                  }
                  patient.telecom = data1;
                  session.close();
                  return patient;
                })
                .then((patient) => {
                  var query = `MATCH (n:Patient{value:"${req.body.id}"})-[r:address{}]->(m) return r,m `;
                  var params = {};
                  var session = driver.session();
                  session
                    .run(query, params)
                    .then((result) => {
                      var data = Object.keys(result.records).map(
                        (el) => result.records[el]._fields[0].properties
                      );
                      var data1 = Object.keys(result.records).map(
                        (el) => result.records[el]._fields[1].properties
                      );
                      for (var i = 0; i < data.length; i++) {
                        data1[i].use = data[i].use;
                      }
                      patient.address = data1;
                      session.close();
                      return patient;
                    })
                    .then((patient) => {
                      var query = `MATCH (n:Patient{value:"${req.body.id}"})-[r:maritialStatus{}]->(m) return r,m `;
                      var params = {};
                      var session = driver.session();
                      session
                        .run(query, params)
                        .then((result) => {
                          var data = result.records[0]._fields[0].properties;
                          var data1 = result.records[0]._fields[1].properties;
                          maritialStatus = {
                            coding: [data1],
                            text: data.text,
                          };
                          session.close();
                          patient.maritialStatus = maritialStatus;
                          return patient;
                        })
                        .then((patient) => {
                          var query = `MATCH (n:Patient{value:"${req.body.id}"})-[r:photo{}]->(m) return m `;
                          var params = {};
                          var session = driver.session();
                          session
                            .run(query, params)
                            .then((result) => {
                              var data =
                                result.records[0]._fields[0].properties;
                              patient.photo = data;
                              session.close();
                              res.send(patient);
                            })
                            .catch((err) => next(err));
                        })
                        .catch((err) => next(err));
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.doctorLogin = async (req, res, next) => {
  var session = driver.session();
  console.log(req.body.id);
  var query = `MATCH (n:doctor) WHERE n.id = "${req.body.id}" return n`;
  session
    .run(query)
    .then(async (result) => {
      if (result.records[0] !== undefined) {
        let passwordMatched = await bcrypt.compare(
          req.body.password,
          result.records[0]._fields[0].properties.password
        );
        if (!passwordMatched) {
          res.send("USERNAME OR PASSWORD NOT CORRECT");
        } else {
          let token = jwt.sign(
            { email: req.body.email },
            process.env.TOKEN_SECRET,
            { expiresIn: 86400 }
          );
          var data = result.records[0]._fields[0].properties;
          data.token = token;
          res.send({ data: data });
        }
      } else {
        res.send({ message: "Unregistered Username" });
      }
    })
    .catch((err) => next(err));
};

exports.setPassword = async (req, res, next) => {
  var session = driver.session();
  var query = ` MATCH (n:Patient{value:$id})  SET n.password = $newPassword return n.value`;
  var params = {
    newPassword: await bcrypt.hash(req.body.password, 10),
    id: `${req.body.id}`,
  };
  session
    .run(query, params)
    .then((result) => {
      console.log(result.records[0]._fields);
      fs.mkdir(
        `${path.resolve()}\\public\\medicalReports\\${req.body.id}`,
        (err) => {
          if (err) console.log(err);
        }
      );
      res.send({ message: "password set" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.changePassword = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n{id:"${req.body.id}"}) return n`;
  session
    .run(query)
    .then(async (result) => {
      if (result.records[0] !== undefined) {
        let passwordMatched = await bcrypt.compare(
          req.body.oldPassword,
          result.records[0]._fields[0].properties.password
        );
        if (!passwordMatched) {
          res.send({ message: "OLD PASSWORD NOT CORRECT" });
        } else {
          var query = ` MATCH (n:people{id:$id}) SET n.password = $newPassword`;
          var params = {
            newPassword: await bcrypt.hash(req.body.newPassword, 10),
            id: `${req.body.id}`,
          };
          session
            .run(query, params)
            .then(() => {
              res.send({ message: "Password changed sucessfully" });
            })
            .catch((err) => {
              next(err);
            });
        }
      } else {
        res.send({ message: "Unregistered Username" });
      }
    })
    .catch((err) => {
      next(err);
    });
};
