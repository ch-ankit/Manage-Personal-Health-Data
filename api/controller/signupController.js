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
        var mailBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Verify your MPHD accont.</title>
            <style>
              /* -------------------------------------
                  GLOBAL RESETS
              ------------------------------------- */
        
              /*All the styling goes here*/
        
              img {
                border: none;
                -ms-interpolation-mode: bicubic;
                max-width: 100%;
              }
        
              body {
                background-color: #f6f6f6;
                font-family: sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
              }
        
              table {
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%;
              }
              table td {
                font-family: sans-serif;
                font-size: 14px;
                vertical-align: top;
              }
        
              /* -------------------------------------
                  BODY & CONTAINER
              ------------------------------------- */
        
              .body {
                background-color: #f6f6f6;
                width: 100%;
              }
        
              /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
              .container {
                display: block;
                margin: 0 auto !important;
                /* makes it centered */
                max-width: 580px;
                padding: 10px;
                width: 580px;
              }
        
              /* This should also be a block element, so that it will fill 100% of the .container */
              .content {
                box-sizing: border-box;
                display: block;
                margin: 0 auto;
                max-width: 580px;
                padding: 10px;
              }
        
              /* -------------------------------------
                  HEADER, FOOTER, MAIN
              ------------------------------------- */
              .main {
                background: #ffffff;
                border-radius: 3px;
                width: 100%;
              }
        
              .wrapper {
                box-sizing: border-box;
                padding: 20px;
              }
        
              .content-block {
                padding-bottom: 10px;
                padding-top: 10px;
              }
        
              .footer {
                clear: both;
                margin-top: 10px;
                text-align: center;
                width: 100%;
              }
              .footer td,
              .footer p,
              .footer span,
              .footer a {
                color: #999999;
                font-size: 12px;
                text-align: center;
              }
        
              /* -------------------------------------
                  TYPOGRAPHY
              ------------------------------------- */
              h1,
              h2,
              h3,
              h4 {
                color: #000000;
                font-family: sans-serif;
                font-weight: 400;
                line-height: 1.4;
                margin: 0;
                margin-bottom: 30px;
              }
        
              h1 {
                font-size: 35px;
                font-weight: 300;
                text-align: center;
                text-transform: capitalize;
              }
        
              p,
              ul,
              ol {
                font-family: sans-serif;
                font-size: 14px;
                font-weight: normal;
                margin: 0;
                margin-bottom: 15px;
              }
              p li,
              ul li,
              ol li {
                list-style-position: inside;
                margin-left: 5px;
              }
        
              a {
                color: #3498db;
                text-decoration: underline;
              }
        
              /* -------------------------------------
                  BUTTONS
              ------------------------------------- */
              .btn {
                box-sizing: border-box;
                width: 100%;
              }
              .btn > tbody > tr > td {
                padding-bottom: 15px;
              }
              .btn table {
                width: auto;
              }
              .btn table td {
                background-color: #ffffff;
                border-radius: 5px;
                text-align: center;
              }
              .btn a {
                background-color: #ffffff;
                border: solid 1px #3498db;
                border-radius: 5px;
                box-sizing: border-box;
                color: #3498db;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
                padding: 12px 25px;
                text-decoration: none;
                text-transform: capitalize;
              }
        
              .btn-primary table td {
                background-color: #3498db;
              }
        
              .btn-primary a {
                background-color: #3498db;
                border-color: #3498db;
                color: #ffffff;
              }
        
              /* -------------------------------------
                  OTHER STYLES THAT MIGHT BE USEFUL
              ------------------------------------- */
              .last {
                margin-bottom: 0;
              }
        
              .first {
                margin-top: 0;
              }
        
              .align-center {
                text-align: center;
              }
        
              .align-right {
                text-align: right;
              }
        
              .align-left {
                text-align: left;
              }
        
              .clear {
                clear: both;
              }
        
              .mt0 {
                margin-top: 0;
              }
        
              .mb0 {
                margin-bottom: 0;
              }
        
              .preheader {
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0;
              }
        
              .powered-by a {
                text-decoration: none;
              }
        
              hr {
                border: 0;
                border-bottom: 1px solid #f6f6f6;
                margin: 20px 0;
              }
        
              /* -------------------------------------
                  RESPONSIVE AND MOBILE FRIENDLY STYLES
              ------------------------------------- */
              @media only screen and (max-width: 620px) {
                table[class="body"] h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
                }
                table[class="body"] p,
                table[class="body"] ul,
                table[class="body"] ol,
                table[class="body"] td,
                table[class="body"] span,
                table[class="body"] a {
                  font-size: 16px !important;
                }
                table[class="body"] .wrapper,
                table[class="body"] .article {
                  padding: 10px !important;
                }
                table[class="body"] .content {
                  padding: 0 !important;
                }
                table[class="body"] .container {
                  padding: 0 !important;
                  width: 100% !important;
                }
                table[class="body"] .main {
                  border-left-width: 0 !important;
                  border-radius: 0 !important;
                  border-right-width: 0 !important;
                }
                table[class="body"] .btn table {
                  width: 100% !important;
                }
                table[class="body"] .btn a {
                  width: 100% !important;
                }
                table[class="body"] .img-responsive {
                  height: auto !important;
                  max-width: 100% !important;
                  width: auto !important;
                }
              }
        
              /* -------------------------------------
                  PRESERVE THESE STYLES IN THE HEAD
              ------------------------------------- */
              @media all {
                .ExternalClass {
                  width: 100%;
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                  line-height: 100%;
                }
                .apple-link a {
                  color: inherit !important;
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  text-decoration: none !important;
                }
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-family: inherit;
                  font-weight: inherit;
                  line-height: inherit;
                }
                .btn-primary table td:hover {
                  background-color: #34495e !important;
                }
                .btn-primary a:hover {
                  background-color: #34495e !important;
                  border-color: #34495e !important;
                }
              }
            </style>
          </head>
          <body class="">
            <span class="preheader">Set your password for MPHD account.</span>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="body"
            >
              <tr>
                <td>&nbsp;</td>
                <td class="container">
                  <div class="content">
                    <!-- START CENTERED WHITE CONTAINER -->
                    <table role="presentation" class="main">
                      <!-- START MAIN CONTENT AREA -->
                      <tr>
                        <td class="wrapper">
                          <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <td>
                                <p>Hi ${req.body.firstName},</p>
                                <p>
                                  Thank you, for registering with Managing Personal
                                  Health Date (MPHD).<br />
                                  Your user id is :${returnValue.id} <br />Press the button below to set
                                  your password.
                                </p>
                                <table
                                  role="presentation"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="btn btn-primary"
                                >
                                  <tbody>
                                    <tr>
                                      <td align="left">
                                        <table
                                          role="presentation"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td>
                                                <a
                                                  href="http://localhost:3000/passwordSet"
                                                  target="_blank"
                                                  >Click here</a
                                                >
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p>
                                  If you did not register with us. Ignore this message.
                                </p>
                                <p>Have a great day.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
        
                      <!-- END MAIN CONTENT AREA -->
                    </table>
                    <!-- END CENTERED WHITE CONTAINER -->
        
                    <!-- START FOOTER -->
                    <div class="footer">
                      <table
                        role="presentation"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td class="content-block">
                            <span class="apple-link">MPHD, Kathmandu, Nepal</span>
                            <br />
                            Don't like these emails?
                            <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                          </td>
                        </tr>
                        <tr>
                          <td class="content-block powered-by">
                            Powered by <a href="http://htmlemail.io">MPHD</a>.
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!-- END FOOTER -->
                  </div>
                </td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>
        `;
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
      telecom2Use: `${
        req.body.email.includes("@gmail.com") ? "personal" : "work"
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
        var mailBody = `<!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Verify your MPHD accont.</title>
            <style>
              /* -------------------------------------
                  GLOBAL RESETS
              ------------------------------------- */
        
              /*All the styling goes here*/
        
              img {
                border: none;
                -ms-interpolation-mode: bicubic;
                max-width: 100%;
              }
        
              body {
                background-color: #f6f6f6;
                font-family: sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
              }
        
              table {
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%;
              }
              table td {
                font-family: sans-serif;
                font-size: 14px;
                vertical-align: top;
              }
        
              /* -------------------------------------
                  BODY & CONTAINER
              ------------------------------------- */
        
              .body {
                background-color: #f6f6f6;
                width: 100%;
              }
        
              /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
              .container {
                display: block;
                margin: 0 auto !important;
                /* makes it centered */
                max-width: 580px;
                padding: 10px;
                width: 580px;
              }
        
              /* This should also be a block element, so that it will fill 100% of the .container */
              .content {
                box-sizing: border-box;
                display: block;
                margin: 0 auto;
                max-width: 580px;
                padding: 10px;
              }
        
              /* -------------------------------------
                  HEADER, FOOTER, MAIN
              ------------------------------------- */
              .main {
                background: #ffffff;
                border-radius: 3px;
                width: 100%;
              }
        
              .wrapper {
                box-sizing: border-box;
                padding: 20px;
              }
        
              .content-block {
                padding-bottom: 10px;
                padding-top: 10px;
              }
        
              .footer {
                clear: both;
                margin-top: 10px;
                text-align: center;
                width: 100%;
              }
              .footer td,
              .footer p,
              .footer span,
              .footer a {
                color: #999999;
                font-size: 12px;
                text-align: center;
              }
        
              /* -------------------------------------
                  TYPOGRAPHY
              ------------------------------------- */
              h1,
              h2,
              h3,
              h4 {
                color: #000000;
                font-family: sans-serif;
                font-weight: 400;
                line-height: 1.4;
                margin: 0;
                margin-bottom: 30px;
              }
        
              h1 {
                font-size: 35px;
                font-weight: 300;
                text-align: center;
                text-transform: capitalize;
              }
        
              p,
              ul,
              ol {
                font-family: sans-serif;
                font-size: 14px;
                font-weight: normal;
                margin: 0;
                margin-bottom: 15px;
              }
              p li,
              ul li,
              ol li {
                list-style-position: inside;
                margin-left: 5px;
              }
        
              a {
                color: #3498db;
                text-decoration: underline;
              }
        
              /* -------------------------------------
                  BUTTONS
              ------------------------------------- */
              .btn {
                box-sizing: border-box;
                width: 100%;
              }
              .btn > tbody > tr > td {
                padding-bottom: 15px;
              }
              .btn table {
                width: auto;
              }
              .btn table td {
                background-color: #ffffff;
                border-radius: 5px;
                text-align: center;
              }
              .btn a {
                background-color: #ffffff;
                border: solid 1px #3498db;
                border-radius: 5px;
                box-sizing: border-box;
                color: #3498db;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
                padding: 12px 25px;
                text-decoration: none;
                text-transform: capitalize;
              }
        
              .btn-primary table td {
                background-color: #3498db;
              }
        
              .btn-primary a {
                background-color: #3498db;
                border-color: #3498db;
                color: #ffffff;
              }
        
              /* -------------------------------------
                  OTHER STYLES THAT MIGHT BE USEFUL
              ------------------------------------- */
              .last {
                margin-bottom: 0;
              }
        
              .first {
                margin-top: 0;
              }
        
              .align-center {
                text-align: center;
              }
        
              .align-right {
                text-align: right;
              }
        
              .align-left {
                text-align: left;
              }
        
              .clear {
                clear: both;
              }
        
              .mt0 {
                margin-top: 0;
              }
        
              .mb0 {
                margin-bottom: 0;
              }
        
              .preheader {
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0;
              }
        
              .powered-by a {
                text-decoration: none;
              }
        
              hr {
                border: 0;
                border-bottom: 1px solid #f6f6f6;
                margin: 20px 0;
              }
        
              /* -------------------------------------
                  RESPONSIVE AND MOBILE FRIENDLY STYLES
              ------------------------------------- */
              @media only screen and (max-width: 620px) {
                table[class="body"] h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
                }
                table[class="body"] p,
                table[class="body"] ul,
                table[class="body"] ol,
                table[class="body"] td,
                table[class="body"] span,
                table[class="body"] a {
                  font-size: 16px !important;
                }
                table[class="body"] .wrapper,
                table[class="body"] .article {
                  padding: 10px !important;
                }
                table[class="body"] .content {
                  padding: 0 !important;
                }
                table[class="body"] .container {
                  padding: 0 !important;
                  width: 100% !important;
                }
                table[class="body"] .main {
                  border-left-width: 0 !important;
                  border-radius: 0 !important;
                  border-right-width: 0 !important;
                }
                table[class="body"] .btn table {
                  width: 100% !important;
                }
                table[class="body"] .btn a {
                  width: 100% !important;
                }
                table[class="body"] .img-responsive {
                  height: auto !important;
                  max-width: 100% !important;
                  width: auto !important;
                }
              }
        
              /* -------------------------------------
                  PRESERVE THESE STYLES IN THE HEAD
              ------------------------------------- */
              @media all {
                .ExternalClass {
                  width: 100%;
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                  line-height: 100%;
                }
                .apple-link a {
                  color: inherit !important;
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  text-decoration: none !important;
                }
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-family: inherit;
                  font-weight: inherit;
                  line-height: inherit;
                }
                .btn-primary table td:hover {
                  background-color: #34495e !important;
                }
                .btn-primary a:hover {
                  background-color: #34495e !important;
                  border-color: #34495e !important;
                }
              }
            </style>
          </head>
          <body class="">
            <span class="preheader">Set your password for MPHD account.</span>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="body"
            >
              <tr>
                <td>&nbsp;</td>
                <td class="container">
                  <div class="content">
                    <!-- START CENTERED WHITE CONTAINER -->
                    <table role="presentation" class="main">
                      <!-- START MAIN CONTENT AREA -->
                      <tr>
                        <td class="wrapper">
                          <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <td>
                                <p>Hi ${req.body.firstName},</p>
                                <p>
                                  Thank you, for registering with Managing Personal
                                  Health Date (MPHD).<br />
                                  Your user id is :${returnValue.id} <br />Press the
                                  button below to set your password.
                                </p>
                                <table
                                  role="presentation"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="btn btn-primary"
                                >
                                  <tbody>
                                    <tr>
                                      <td align="left">
                                        <table
                                          role="presentation"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td>
                                                <a
                                                  href="http://localhost:3000/passwordSet/doctor"
                                                  target="_blank"
                                                  >Click here</a
                                                >
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p>
                                  If you did not register with us. Ignore this message.
                                </p>
                                <p>Have a great day.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
        
                      <!-- END MAIN CONTENT AREA -->
                    </table>
                    <!-- END CENTERED WHITE CONTAINER -->
        
                    <!-- START FOOTER -->
                    <div class="footer">
                      <table
                        role="presentation"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td class="content-block">
                            <span class="apple-link">MPHD, Kathmandu, Nepal</span>
                            <br />
                            Don't like these emails?
                            <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                          </td>
                        </tr>
                        <tr>
                          <td class="content-block powered-by">
                            Powered by <a href="http://htmlemail.io">MPHD</a>.
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!-- END FOOTER -->
                  </div>
                </td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>
        `;
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
        `${path.resolve()}//public//medicalRecords//${req.body.id}`,
        (err) => {
          if (err) console.log(err);
        }
      );
      fs.mkdir(
        `${path.resolve()}//public//medicalReports//${req.body.id}`,
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
