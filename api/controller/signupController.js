const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var path = require('path');
const fs = require('fs')

var driver = require("./../database");
var sendMail = require("./../nodemailer")

var checker = async (label, email, next) => {
  var session = driver.session();
  var query = `MATCH (n:${label}{email:$email}) RETURN n.email`
  var params = {
    label: label,
    email: email
  }
  var al = await session.run(query, params)
  return al.records[0]
};

exports.patientSignup = async (req, res, next) => {
  var x = await checker("patient", `${req.body.email}`, next)
  x = (x === undefined) ? false : true;
  if (!x) {
    var session = driver.session();
    const params = {
      address: `${req.body.address}`,
      contactInfo: `${req.body.contactInfo}`,
      dob: `${req.body.dob}`,
      email: `${req.body.email}`,
      emergencyContactName: `${req.body.emergencyContactName}`,
      emergencyContactNo: `${req.body.emergencyContactNo}`,
      emergencyContactRltn: `${req.body.emergencyContactRltn}`,
      gender: `${req.body.gender}`,
      language: `${req.body.language}`,
      maritalStatus: `${req.body.maritalStatus}`,
      name: `${req.body.name}`,
      zipCode: `${req.body.zipCode}`,
      photo: `${req.body.photo}`
    }
    var query = `MERGE (n:people:patient{
        address:$address,
        contactInfo:$contactInfo,
        dob:$dob,
        email:$email,
        emergencyContactName:$emergencyContactName,
        emergencyContactNo:$emergencyContactNo,
        emergencyContactRltn:$emergencyContactRltn,
        gender:$gender,
        language:$language,
        maritalStatus:$maritalStatus,
        name:$name,
        zipCode:$zipCode,
        photo:$photo
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
        var query = `MATCH (n:patient{email:$email}) SET n.id = $id`;
        session
          .run(query, returnValue)
          .catch(err => next(err))
        var mailBody = `<h3>Thank You For Registering with MPHD</h3><br><p>Your login user id is :</p><br><p>Username:${returnValue.id}</p><h5>Procseed to following link for setting your password: http://localhost:7000/passwordSet</h5>`
        sendMail.sendMail(`${returnValue.email}`, mailBody, next)
      })
      .catch((err) => {
        next(err);
      });
  } else {
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

