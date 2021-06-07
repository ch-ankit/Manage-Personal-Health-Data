const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var path = require('path');
const fs = require('fs')

var driver = require("./../database");
var sendMail = require("./../nodemailer")

var checker = async (label, email, next) => {
 try{ var session = driver.session();
  var query = `MATCH (n:${label}{email:$email}) RETURN n.email`
  var params = {
    label: label,
    email: email
  }
  var al = await session.run(query, params)
  return al.records[0]}
  catch(err){
    next(err)
  }
};

var uniqueId = async (dob,label,next)=>{
  var session = driver.session();
  var dob = dob.split('-').join('');
  var id = `${dob} - ${10+Math.floor(Math.random()*89)}${10+Math.floor(Math.random()*89)}${10+Math.floor(Math.random()*89)}`;
  console.log(id)
  var query = `MATCH (n:${label}{value:$value}) RETURN n.value`
  var params = {
    label: label,
    value: id
  }
  var al = await session.run(query, params)
  if(!al.records[0]){
    console.log(id)
    var session = driver.session();
    var params1 = {
      identifierUse:`official`,
      identifierCodingSystem:`https://terminology.hl7.org/2.1.0/CodeSystem-v2-0203.html`,
      identifierCodingCode:`DOB-Random(000000-999999)`,
      identifierSystem:`localhost:3000/static/uniquecodegeneration`,
      value:id,
      lable:label
    }
    session.run(`CREATE (n:${label}{
                identifierUse:$identifierUse,
                identifierCodingSystem:$identifierCodingSystem,
                identifierCodingCode:$identifierCodingCode,
                identifierSystem:$identifierSystem,
                value:$value
                })`,params1)
                .catch((err)=>{
                  next(err)
                });
                return id
  }else{
    uniqueId(dob,label)
  }
}


exports.patientSignup = async (req, res, next) => {
  var x = await checker("Patient", `${req.body.email}`, next)
  x = (x === undefined) ? false : true;
  if (!x) {
    var session = driver.session();
    var id = await uniqueId(`${req.body.dob}`,"Patient",next)
    const params = {
      resourceType:`Patient`,
      identifierValue:`${id}`,
      active:true,
      nameUse:`official`,
      nameFamily:`${req.body.lastName}`,
      given:[`${req.body.firstName}`,`${req.body.middleName}`],
      prefix:`${req.body.prefix}`,
      suffix:`${req.body.suffix}`,
      telecom1System:`phone`,
      telecom1Value:`${req.body.mobileNo}`,
      telecom1Use:`mobile`,
      telecom1rank:1,
      telecom2System:`email`,
      telecom2Value:`${req.body.email}`,
      telecom2Use:`${req.body.email.includes('@gmail.com')?'personal':'work'}`,
      telecom2rank:2,
      gender:`${req.body.gender}`,
      birthDate:`${req.body.dob}`,
      deceasedBoolean: false,
      addressUse:`home`,
      addressType:`both`,
      addressText:`${req.body.city},${req.body.district},${req.body.state},${req.body.country}`,
      city:`${req.body.city}`,
      district:`${req.body.district}`,
      state:`${req.body.state}`,
      country:`${req.body.country}`,
      line:[`${req.body.houseNo}`,`${req.body.streetName}`],
      postalCode:`${req.body.postalCode}`,
      maritalStatusCodingSystem:`https://www.hl7.org/fhir/valueset-marital-status.html`,
      maritalStatusCodingCode:`${req.body.maritialStatusCode}`,
      maritalStatustext:`${req.body.maritialStatus}`,
      multipleBirthBoolean:(req.body.multipleBirthBoolean==='true'),
      multipleBirthInteger:parseInt(req.body.birthOrder),
      photoContentType:"image/*",
      photoUrl:`${req.body.photo}`,
      photoCreation:Date(),
      communicationLanguageCodingSystem:'https://www.hl7.org/fhir/valueset-languages.html',
      communicationLanguageCodingCode:`${req.body.languageCode}`,
      communicationLanguagetext:`${req.body.language}`,
      communicationprefered:true
    }
var query = `MATCH(n:Patient{value:$identifierValue})
            MERGE(n)-[:identifies{}]->(m:patient{resourceType:$resourceType,active:$active,gender:$gender,birthDate:$birthDate,deceasedBoolean:$deceasedBoolean,multipleBirthBoolean:$multipleBirthBoolean,multipleBirthInteger:$multipleBirthInteger})
            MERGE(n)-[a:hasName{use:$nameUse}]->(o:name{given:$given,family:$nameFamily,prefix:$prefix,suffix:$suffix})
            MERGE(n)-[:telecom{system:$telecom1System}]->(q:phone{use:$telecom1Use,value:$telecom1Value,rank:$telecom1rank})
            MERGE(n)-[:address{use:$addressUse}]->(r:addressUse{type:$addressType,text:$addressText,line:$line,city:$city,district:$district,country:$country,state:$state,postalCode:$postalCode})
            MERGE(n)-[:maritialStatus{text:$maritalStatustext}]->(:coding{code:$maritalStatusCodingCode,system:$maritalStatusCodingSystem})
            MERGE(n)-[:photo]->(:photo{contentType:$photoContentType,url:$photoUrl,creation:$photoCreation})
            MERGE(n)-[:communication{preferred:$communicationprefered,text:$communicationLanguagetext}]->(:coding{system:$communicationLanguageCodingSystem,code:$communicationLanguageCodingCode})`;

    session
      .run(query, params)
      .then((result) => {
        var returnValue = {
          email: `${req.body.email}`,
          id: id
        }
        res.send({ message: "Signup successfull, Login Credentials will be forwarded to you through registered email" });
        return returnValue;
      }).then((returnValue) => {
        console.log(returnValue)
        var mailBody = `<h3>Thank You For Registering with MPHD</h3><br><p>Your login user id is :</p><br><p>Username:${returnValue.id}</p><h5>Procseed to following link for setting your password: http://localhost:7000/passwordSet</h5>`
        sendMail.sendMail(`${returnValue.email}`, mailBody, next)
      })
      .catch((err) => {
        next(err);
      });
  }else {
    res.send({ message: "email is aready registered" })
  }
};


exports.doctorSignup = async (req, res, next) => {
  var x = await checker("doctor", `${req.body.email}`, next)
  x = (x === undefined) ? false : true;
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
      qualification: `${req.body.qualification}`
    }
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
          id: `${req.body.dob}` + `${req.body.zipCode}`
        }
        res.send({ message: "Signup successfull, Login Credentials will be forwarded to you through registered email" });
        return returnValue;
      }).then((returnValue) => {
        console.log(returnValue)

        var query = `MATCH (n:doctor{email:$email}) SET n.id = $id`;
        session
          .run(query, returnValue)
          .catch(err => next(err))
        var mailBody = `<h3>Thank You For Registering with MPHD</h3><br><p>Your login user id is :</p><br><p>Username:${returnValue.id}</p><h5>Procseed to following link for setting your password: http://localhost:7000/home</h5>`
        sendMail.sendMail(`${returnValue.email}`, mailBody, next)
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.send({ message: "email is aready registered" })
  }
};

exports.patientLogin = async (req, res, next) => {
  console.log(req.body)
  var session = driver.session();
  console.log(req.body.id)
  var query = `MATCH (n:people) WHERE n.id = "${req.body.id}" return n`
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
            process.env.TOKEN_SECRET, { expiresIn: 86400 }
          );
          var data = result.records[0]._fields[0].properties;
          data.token = token;
          res.send({ data: data })
        }
      } else {
        res.send({ message: "Unregistered Username" })
      }
    }).catch(err => next(err))
}

exports.doctorLogin = async (req, res, next) => {
  var session = driver.session();
  console.log(req.body.id)
  var query = `MATCH (n:doctor) WHERE n.id = "${req.body.id}" return n`
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
            process.env.TOKEN_SECRET, { expiresIn: 86400 }
          );
          var data = result.records[0]._fields[0].properties;
          data.token = token;
          res.send({ data: data })
        }
      } else {
        res.send({ message: "Unregistered Username" })
      }
    }).catch(err => next(err))
}

exports.setPassword = async (req, res, next) => {
  var session = driver.session();
  var query = ` MATCH (n:people{id:$id})  SET n.password = $newPassword return n.id`
  var params = {
    newPassword: await bcrypt.hash(req.body.password, 10),
    id: `${req.body.id}`
  }
  session.run(query, params)
    .then((result) => {
      console.log(result.records[0]._fields)
      fs.mkdir(`${path.resolve()}\\public\\medicalReports\\${req.body.id}`, (err) => {
        if (err) console.log(err);
      })
      res.send({ message: "password set" })
    }).catch(err => {
      next(err)
    })
}

exports.changePassword = async (req, res, next) => {
  var session = driver.session();
  var query = `MATCH (n{id:"${req.body.id}"}) return n`
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
          var query = ` MATCH (n:people{id:$id}) SET n.password = $newPassword`
          var params = {
            newPassword: await bcrypt.hash(req.body.newPassword, 10),
            id: `${req.body.id}`
          }
          session
            .run(query, params)
            .then(() => {
              res.send({ message: "Password changed sucessfully" })
            })
            .catch(err => {
              next(err)
            })
        }
      } else {
        res.send({ message: "Unregistered Username" })
      }
    })
    .catch(err => {
      next(err)
    })
}


