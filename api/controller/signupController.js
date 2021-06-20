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
    var query = `MATCH (n:${label})-[:telecom{system:"email"}]->(m{value:$email}) RETURN m.email`;
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
  var id = `${dob}-${10 + Math.floor(Math.random() * 89)}${10 + Math.floor(Math.random() * 89)
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
      telecom2Use: `${req.body.email.includes("@gmail.com") ? "personal" : "work"
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
  var x;
  var checker = async () => {
    try {
      var session = driver.session();
      var query = `MATCH (n:Practitioner{value:"${req.body.id}"}) RETURN n`;
      var al = await session.run(query);
      return al.records[0];
    } catch (err) {
      next(err);
    }
  };
  x = await checker();
  x = x === undefined ? false : true;
  console.log(x);
  if (!x) {
    var session = driver.session();
    const params = {
      resourceType: `Practitioner`,
      identifierValue: `${req.body.id}`,
      identifierUse: `official`,
      identifierCodingCode: "ID BY NMA",
      identifierCodingSystem: "Website of NMA that defines code",
      identifierSystem: "NMC URL that generates unique id",
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
      telecom2Use: `${req.body.email.includes("@gmail.com") ? "personal" : "work"
        }`,
      telecom2rank: 2,
      gender: `${req.body.gender}`,
      birthDate: `${req.body.dob}`,
      addressUse: `home`,
      addressType: `both`,
      addressText: `${req.body.city},${req.body.district},${req.body.state},${req.body.country}`,
      city: `${req.body.city}`,
      district: `${req.body.district}`,
      state: `${req.body.state}`,
      country: `${req.body.country}`,
      line: [`${req.body.houseNo}`, `${req.body.streetName}`],
      postalCode: `${req.body.postalCode}`,
      photoContentType: "image/*",
      photoUrl: `${req.body.photo}`,
      photoCreation: Date(),
      communicationLanguageCodingSystem:
        "https://www.hl7.org/fhir/valueset-languages.html",
      communicationLanguageCodingCode: `${req.body.languageCode}`,
      communicationLanguagetext: `${req.body.language}`,
      communicationprefered: true,
      qualificationCodeSystem: `"${req.body.qualificationCodeSystem}"`,
      qualificationCodeCode: `"${req.body.qualificationCodeCode}"`,
      qualificationCodeDisplay: `"${req.body.qualificationCodeDisplay}"`,
      qualificationCodetext: `"${req.body.qualificationCodetext}"`,
      qualificationIdentifierSystem: `"${req.body.qualificationIdentifierSystem}"`,
      qualificationIdentifierValue: `"${req.body.qualificationIdentifierValue}"`,
      periodStart: `"${req.body.periodStart}"`,
      issuer: `"${req.body.issuer}"`,
    };
    var query = `CREATE (n:Practitioner{identifierUse:$identifierUse,identifierCodingSystem:$identifierCodingSystem,identifierCodingCode:$identifierCodingCode,identifierSystem:$identifierSystem,value:$identifierValue})
    MERGE(n)-[:identifies{}]->(m:doctor{resourceType:$resourceType,active:$active,gender:$gender,birthDate:$birthDate})
    MERGE(n)-[a:hasName{use:$nameUse}]->(o:name{given:$given,family:$nameFamily,prefix:$prefix,suffix:$suffix})
    MERGE(n)-[:telecom{system:$telecom1System}]->(q:phone{use:$telecom1Use,value:$telecom1Value,rank:$telecom1rank})
    MERGE(n)-[:telecom{system:$telecom2System}]->(q1:phone{use:$telecom2Use,value:$telecom2Value,rank:$telecom2rank})
    MERGE(n)-[:address{use:$addressUse}]->(r:addressUse{type:$addressType,text:$addressText,line:$line,city:$city,district:$district,country:$country,state:$state,postalCode:$postalCode})
    MERGE(n)-[:photo]->(:photo{contentType:$photoContentType,url:$photoUrl,creation:$photoCreation})
    MERGE(n)-[:communication{preferred:$communicationprefered,text:$communicationLanguagetext}]->(:coding{system:$communicationLanguageCodingSystem,code:$communicationLanguageCodingCode})
    MERGE(n)-[:qualification{system:$qualificationCodeSystem,code:$qualificationCodeCode,display:$qualificationCodeDisplay,text:$qualificationCodetext}]->(:qualification{identifierSystem:$qualificationIdentifierSystem,identifierValue:$qualificationIdentifierValue,periodStart:$periodStart,issuerDisplay:$issuer})
    `;
    session
      .run(query, params)
      .then(() => {
        var returnValue = {
          id: `${req.body.id}`,
          email: `${req.body.email}`,
        };
        res.send({
          message:
            "Doctor Signup successfull, Login Credentials will be forwarded to you through registered email",
        });
        return returnValue;
      })
      .then((returnValue) => {
        var mailBody = `<h3>Thank You For Registering with MPHD</h3><br><p>Your login user id is :</p><br><p>Username:${returnValue.id}</p><h5>Procseed to following link for setting your password: http://localhost:3000/passwordSet/doctor</h5>`;
        sendMail.sendMail(`${returnValue.email}`, mailBody, next);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.send({ message: "ID is aready registered" });
  }
};

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
          {
            var query = `MATCH (n:Patient{value:"${req.body.id}"}) -[:identifies{}]->(m:patient) return m`;
            var params = {};
            session
              .run(query, params)
              .then((result) => {
                patient = {
                  ...patient,
                  ...result.records[0]._fields[0].properties,
                };
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
                                var data =
                                  result.records[0]._fields[0].properties;
                                var data1 =
                                  result.records[0]._fields[1].properties;
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
                                    return patient;
                                  })
                                  .then((patient) => {
                                    var query = `MATCH (n:Patient{value:"${req.body.id}"})-[r:communication{}]->(m) return r,m `;
                                    var params = {};
                                    var session = driver.session();
                                    session
                                      .run(query, params)
                                      .then((result) => {
                                        var data = Object.keys(
                                          result.records
                                        ).map(
                                          (el) =>
                                            result.records[el]._fields[0]
                                              .properties
                                        );
                                        var data1 = Object.keys(
                                          result.records
                                        ).map(
                                          (el) =>
                                            result.records[el]._fields[1]
                                              .properties
                                        );
                                        var communication = [
                                          {
                                            language: {
                                              coding: [],
                                              text: "",
                                            },
                                            preferred: "false",
                                          },
                                        ];
                                        for (var i = 0; i < data1.length; i++) {
                                          communication[i].language.coding.push(
                                            data1[i]
                                          );
                                          communication[i].language.text =
                                            data[i].text;
                                          communication[i].preferred =
                                            data[i].preferred;
                                        }

                                        console.log(communication);
                                        patient.communication = communication;
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
          }
        }
      } else {
        res.send({ message: "Unregistered Username" });
      }
    })
    .catch((err) => next(err));
};

exports.doctorLogin = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:Practitioner{value:"${req.body.id}"}) return n`;
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
          var Practitioner = {};
          Practitioner.identifier = [
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
          Practitioner.token = token;
          {
            var query = `MATCH (n:Practitioner{value:"${req.body.id}"}) -[:identifies{}]->(m:doctor) return m`;
            var params = {};
            session
              .run(query, params)
              .then((result) => {
                Practitioner = {
                  ...Practitioner,
                  ...result.records[0]._fields[0].properties,
                };
                session.close();
                return Practitioner;
              })
              .then((Practitioner) => {
                var query = `MATCH (n:Practitioner{value:"${req.body.id}"})-[r:hasName{}]->(m:name) return r,m `;
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
                    Practitioner.name = data1;
                    session.close();
                    return Practitioner;
                  })
                  .then((Practitioner) => {
                    var query = `MATCH (n:Practitioner{value:"${req.body.id}"})-[r:telecom{}]->(m) return r,m `;
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
                        Practitioner.telecom = data1;
                        session.close();
                        return Practitioner;
                      })
                      .then((Practitioner) => {
                        var query = `MATCH (n:Practitioner{value:"${req.body.id}"})-[r:address{}]->(m) return r,m `;
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
                            Practitioner.address = data1;
                            session.close();
                            return Practitioner;
                          })
                          .then((Practitioner) => {
                            var query = `MATCH (n:Practitioner{value:"${req.body.id}"})-[r:qualification{}]->(m) return r,m `;
                            var params = {};
                            var session = driver.session();
                            session
                              .run(query, params)
                              .then((result) => {
                                var data = Object.keys(result.records).map(
                                  (el) =>
                                    result.records[el]._fields[0].properties
                                );
                                var data1 = Object.keys(result.records).map(
                                  (el) =>
                                    result.records[el]._fields[1].properties
                                );
                                var qualification = [];
                                for (var i = 0; i < data.length; i++) {
                                  qualification[i] = {
                                    identifier: [
                                      {
                                        system: data1[i].identifierSystem,
                                        value: data1[i].identifierValue,
                                      },
                                    ],
                                    code: {
                                      coding: [
                                        {
                                          system: data[i].system,
                                          code: data[i].code,
                                          display: data[i].display,
                                        },
                                      ],
                                      text: data[i].text,
                                    },
                                    period: {
                                      start: data1[i].periodStart,
                                    },
                                    issuer: {
                                      display: data1[i].issuerDisplay,
                                    },
                                  };
                                }
                                Practitioner.qualification = qualification;
                                session.close();
                                return Practitioner;
                              })
                              .then((Practitioner) => {
                                var query = `MATCH (n:Practitioner{value:"${req.body.id}"})-[r:photo{}]->(m) return m `;
                                var params = {};
                                var session = driver.session();
                                session
                                  .run(query, params)
                                  .then((result) => {
                                    var data =
                                      result.records[0]._fields[0].properties;
                                    Practitioner.photo = data;
                                    session.close();
                                    return Practitioner;
                                  })
                                  .then((Practitioner) => {
                                    var query = `MATCH (n:Practitioner{value:"${req.body.id}"})-[r:communication{}]->(m) return r,m `;
                                    var params = {};
                                    var session = driver.session();
                                    session
                                      .run(query, params)
                                      .then((result) => {
                                        var data = Object.keys(
                                          result.records
                                        ).map(
                                          (el) =>
                                            result.records[el]._fields[0]
                                              .properties
                                        );
                                        var data1 = Object.keys(
                                          result.records
                                        ).map(
                                          (el) =>
                                            result.records[el]._fields[1]
                                              .properties
                                        );
                                        var communication = [
                                          {
                                            language: {
                                              coding: [],
                                              text: "",
                                            },
                                            preferred: "false",
                                          },
                                        ];
                                        for (var i = 0; i < data1.length; i++) {
                                          communication[i].language.coding.push(
                                            data1[i]
                                          );
                                          communication[i].language.text =
                                            data[i].text;
                                          communication[i].preferred =
                                            data[i].preferred;
                                        }

                                        console.log(communication);
                                        Practitioner.communication =
                                          communication;
                                        session.close();
                                        res.send(Practitioner);
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
          }
        }
      } else {
        res.send({ message: "Unregistered Username" });
      }
    })
    .catch((err) => next(err));
};

exports.setPasswordPatient = async (req, res, next) => {
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

exports.changePasswordPatient = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:Patient{value:"${req.body.id}"}) return n`;
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
          var query = ` MATCH (n{value:$id}) SET n.password = $newPassword`;
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

exports.setPasswordDoctor = async (req, res, next) => {
  var session = driver.session();
  var query = ` MATCH (n:Practitioner{value:$id})  SET n.password = $newPassword return n.value`;
  var params = {
    newPassword: await bcrypt.hash(req.body.password, 10),
    id: `${req.body.id}`,
  };
  session
    .run(query, params)
    .then(() => {
      res.send({ message: "password set" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.changePasswordDoctor = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n:Practitioner{value:"${req.body.id}"}) return n`;
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
          var query = ` MATCH (n:Practitioner{value:$id}) SET n.password = $newPassword`;
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
