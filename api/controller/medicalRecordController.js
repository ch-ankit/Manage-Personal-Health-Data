var driver = require("../database");
var path = require("path");
var multer = require("multer");
const fs = require("fs");
var path = require("path");
var pdfReader = require("pdfreader");

exports.getRecord = async (req, res, next) => {
  try {
    res.sendFile(
      `${path.resolve()}\\public\\medicalRecord\\${req.query.id}\\${
        req.query.reportName
      }`
    );
  } catch (err) {
    next(err);
  }
};

exports.addRecord = async (req, res, next) => {
  try {
    var patientId;
    upload(req, res, function (err) {
      patientId = req.body.id;
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
        // A Multer error occurred when uploading.
      } else if (err) {
        return res.status(500).json(err);
        // An unknown error occurred when uploading.
      }

      return res.status(200).send({ message: "upload successfull" });
      // Everything went fine.
    });
    setTimeout(() => {
      var y;
      var text;
      var recordData = "";
      //   var medicalData = {
      //     "resourceType":"DocumentReference",
      //     "masterIdentifier":{
      //         "use": "official",
      //         "type": {
      //             "coding": [
      //                 {
      //                     "system": "url of system which defines what is used by our system to generate this value of identifier Eg: PatientId-CreatedDate",
      //                     "code": "PID-DATE"
      //                 }
      //             ],
      //             "text": "Patient id and the date the document was created is used to generate the masterIdentifier"
      //         },
      //         "system": "url of our system which generates this value",
      //         "value": "Identifier value for this version of the document. This master identifier is used for this specific version of the document another version has seperate master identifier but can have the same identifier"
      //     },
      //     "identifier": [
      //         {
      //             "use": "official",
      //             "type": {
      //                 "coding": [
      //                     {
      //                         "system": "url of system which defines what is used by our system to generate this value of identifier Eg: PatientId-CreatedDate",
      //                         "code": "PID-DATE"
      //                     }
      //                 ],
      //                 "text": "Patient id and the date the document was created is used to generate the identifier"
      //             },
      //             "system": "url of our system which generates this value",
      //             "value": "value of the identifier"
      //         }
      //     ],
      //     "status": " preliminary | final | amended | entered-in-error",
      //     "type": {
      //         "coding": [
      //             {
      //                 "system": "https://www.hl7.org/fhir/valueset-c80-doc-typecodes.html | http://loinc.org",
      //                 "code": "55107-7. This is in the url very long list"
      //             }
      //         ],
      //         "text": "Addendum Document"
      //     },
      //     "category": [
      //         {
      //             "coding": [
      //                 {
      //                     "system": "http://localhost:3000/DocumentCategorySet",
      //                     "code": "History and Physical",
      //                     "display": "History and Physical"
      //                 }
      //             ]
      //         }
      //     ],
      //     "subject": {
      //         "reference": "url of patient",
      //         "type": "Patient",
      //         "identifier": {
      //             "system": "patient identifier generator systme url ",
      //             "value": "patientId"
      //         },
      //         "display": "Patient Name"
      //     },
      //     "date": "YYYY-MM-DDThh:mm:ss.sss+zz:zz <instant this document was created>",
      //     "author": [
      //         {
      //             "reference": "url of practitioner",
      //             "type": "Practitioner",
      //             "identifier": {
      //                 "system": "Practitioner identifier generator systme url // NMC url",
      //                 "value": "practitionerId"
      //             },
      //             "display": "Name of Practitioner"
      //         }
      //     ],
      //     "authenticator": {
      //         "reference": "url of practitioner who autheticated this document can be same as above in our case",
      //         "type": "Practitioner",
      //         "identifier": {
      //             "system": "Practitioner identifier generator systme url // NMC url",
      //             "value": "practitionerId"
      //         },
      //         "display": "Name of Practitioner"
      //     },
      //     "custodian": {
      //         "reference": "Our app so we are the organizationn maitaining the document so our url",
      //         "type": "Organization",
      //         "identifier": {
      //             "system": "who gives organization id that system url",
      //             "value": "organizationID"
      //         },
      //         "display": "Managing Personal Health Data"
      //     },
      //     "relatesTo":[
      //         {
      //             "code": "appends|replaces|signs",
      //             "target": {
      //                 "reference": "url of referenced report",
      //                 "identifier": {
      //                     "system": "url of system where report is present",
      //                     "value": "12345"
      //                 },
      //                 "display": "Regular CheckUp Reprot"
      //             }
      //         }
      //     ],
      //     "description": "<string descriptio  of the report>",
      //     "securityLabel": [
      //         {
      //             "coding": [
      //                 {
      //                     "system": "url",
      //                     "code":"S"
      //                 }
      //             ],
      //             "text": "Cleared for sharing report"
      //         }
      //     ],
      //     "content": [
      //         {
      //             "attachment": {
      //                 "contentType": "*/pdf",
      //                 "language": "en",
      //                 "data": "",
      //                 "url":"",
      //                 "size": 0,
      //                 "hash": "",
      //                 "title": "",
      //                 "creation": "<dateTime>"
      //             },
      //             "format": {
      //                 "system": "",
      //                 "code": "",
      //                 "display": ""
      //             }
      //         }
      //     ],
      //     "context": {
      //         "encounter": [
      //             {
      //                 "reference": "url of encounter",
      //                 "identifier": {
      //                     "system": "",
      //                     "value": ""
      //                 },
      //                 "display": ""
      //             }
      //         ],
      //         "event": [
      //             {
      //                 "coding": [
      //                     {
      //                         "system": "url for codes",
      //                         "code": "T-D8200",
      //                         "display": "Arm"
      //                     }
      //                 ],
      //                 "text": "Arm pain problem"
      //             }
      //         ],
      //         "period": {
      //             "start": "<dateTime>",
      //             "end": "<dateTime>"
      //         },
      //         "facilityType": {
      //             "coding": [
      //                 {
      //                     "system": "url of system for codes",
      //                     "code": "OPD",
      //                     "display": ""
      //                 }
      //             ],
      //             "text": "Out patient department"
      //         },
      //         "practiceSetting": {
      //             "coding": [
      //                 {
      //                     "system": "url for codes",
      //                     "code": "General Medicine",
      //                     "display": ""
      //                 }
      //             ],
      //             "text": "General medicine"
      //         },
      //         "sourcePatientInfo": {
      //             "reference": "url of patient",
      //             "identifier": {
      //                 "system": "",
      //                 "value": "PatientID"
      //             },
      //             "display": ""
      //         },
      //         "related": [
      //             {
      //                 "reference": "url of related observation/report/documents",
      //                 "identifier": {
      //                     "system": "",
      //                     "value": ""
      //                 },
      //                 "display": "Realted to this document"
      //             }
      //         ]
      //     }
      // }
      fs.readFile(
        `${path.resolve()}//public//medicalReports//${patientId}//ReportSample.pdf`,
        (err, pdfBuffer) => {
          // pdfBuffer contains the file content
          new pdfReader.PdfReader().parseBuffer(
            pdfBuffer,
            function (err, item) {
              if (err) console.log(err);
              else if (!item) {
                // console.log(text);
                recordData = recordData + text;
                console.log(recordData);
                recordData.replace(/\r\n/g, " ");
                // medicalData.deviceReference =
                //   /Device Reference:\s(.*?)Medical/i.exec(recordData)[1];
                // medicalData.identifierValue =
                //   /Report Id:\s(.*?)Master ReportId:/i.exec(recordData)[1];
                // medicalData.derivedFromIdentifierValue =
                //   /Master ReportId:\s(.*?)Patient Id:/i.exec(recordData)[1];
                // medicalData.subjectIdentifierValue =
                //   "20000101-687825"; /*/Patient\s(.*?)Date:/i
                // .exec(recordData)[1]
                // .slice(3);*/
                // medicalData.effectiveDateTime =
                //   /Date:\s(.*?)Report Type:/i.exec(recordData)[1];
                // medicalData.issued = /Date:\s(.*?)Report Type:/i.exec(
                //   recordData
                // )[1];
                // medicalData.partOfType = /Report Type:\s(.*?)Reference:/i.exec(
                //   recordData
                // )[1];
                // medicalData.referenceRangeText =
                //   /TestReference:\s(.*?)Status:/i.exec(recordData)[1];
                // medicalData.status = /Status:\s(.*?)Category:/i.exec(
                //   recordData
                // )[1];
                // medicalData.categoryCoding = /Category:\s(.*?)Code:/i.exec(
                //   recordData
                // )[1];
                // medicalData.codeCodingCode = /Code:\s(.*?)Focus:/i.exec(
                //   recordData
                // )[1];
                // medicalData.focusReference = /Focus:\s(.*?)Specimen:/i.exec(
                //   recordData
                // )[1];
                // medicalData.specimenIdentifierValue =
                //   /Specimen:\s(.*?)Performed By:/i.exec(recordData)[1];
                // medicalData.performerIdentifierValue = /Performed By:\s(.*?)S./i
                //   .exec(recordData)[1]
                //   .slice(0, 7);
                // medicalData.performerDisplay = /Performed By:\s(.*?)Bio/i
                //   .exec(recordData)[1]
                //   .slice(7)
                //   .replace("S.No.", "");

                // historyTodatabase(medicalData, next);
              } else if (item.text) {
                if (text === undefined) {
                  text = item.text;
                } else if (y === item.y) {
                  text = text + item.text;
                } else {
                  // console.log(text);
                  recordData = recordData + text;
                  text = item.text;
                }

                y = item.y;
              }
            }
          );
        }
      );
    }, 5000);
  } catch (err) {
    next(err);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body.id);
    cb(null, `public\\medicalReports\\${req.body.id}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).array("file");

exports.changeReport = (req, res, next) => {
  res.send(req.body);
};

async function historyTodatabase(reportObj, next) {
  var session = driver.session();
  var params = reportObj;
  var query = `MATCH(n:Patient{value:$subjectIdentifierValue})
              MERGE(n)-[:medicalHistroy{use:$identifierUse,identifierSystem:$identifierSystem,identifierValue:$identifierValue}]->(m:observation{system:$identifierCodingSystem,code:$identifierCodingCode})
              MERGE(m)-[:basedOn]->(q:basedOn{reference:$basedOnReference,type:$basedOnType,display:$basedOnDisplay})
              MERGE(q)-[:basedOnIdentifies{use:$basedOnIdentifierUse,system:$basedOnIdentifierSystem,value:$basedOnIdentifiervalue}]->(:coding{system:$basedOnIdentifierCodingSystem,code:$basedOnIdentifierCodingCode})
              MERGE(m)-[:partOfIdentifier{system:$partOfIdentifierSystem,value:$partOfIdentifierValue}]->(:partOf{referrence:$partOfReference,type:$partOfType,display:$partOfDisplay})
              MERGE(m)-[:miscellenous]->(:miscellanous{resourceType:$resourceType,status:$status,effectiveDateTime:$effectiveDateTime,issued:$issued})
              MERGE(m)-[:category{text:$categoryText}]->(:categoryCoding{code:$categoryCodingCode,systme:$categoryCodingSystem,display:$categoryCodingDisplay})
              MERGE(m)-[:code{text:$codeText}]->(:codeCoding{system:$codeCodingSystem,code:$codeCodingCode,display:$codeCodingDisplay})
              MERGE(m)-[:belongsTo{value:$subjectIdentifierValue}]->(:subject{reference:$subjectReference,type:$subjectType,display:$subjectDisplay})
              MERGE(m)-[:focus]->(:focus{refernce:$focusReference})
              MERGE(m)-[:encounter{value:$encounterIdentifierValue}]-(:encounter{reference:$encounterReference,type:$encounterType,display:$encounterDisplay})
              MERGE(m)-[:performer{value:$performerIdentifierValue}]-(:performer{reference:$performerReference,type:$performerType,display:$performerDisplay})
              MERGE(m)-[:dataAbsentReason{text:$dataAbsentReasonText}]->(:coding{system:$dataAbsentReasonCodingSystem,code:$dataAbsentReasonCodingCode})
              MERGE(m)-[:interpretation{text:$interpretationText}]->(:coding{system:$interpretationCodingSystem,code:$interpretationCodingCode})
              MERGE(m)-[:note{authorString:$noteAuthorString,time:$noteTime,text:$noteText}]-(:authorReference{reference:$authorReferenceReference,type:$authorReferenceType})-[:identifies{}]->(:authorIdentifier{system:$noteAuthorReferenceIdentifierSystem,value:$noteAuthorReferenceIdentifierValue})
              MERGE(m)-[:bodySite{text:$bodySiteText}]->(:coding{system:$bodySiteCodingSystem,code:$bodySiteCodingCode})
              MERGE(m)-[:method{text:$methodText}]->(:coding{system:$methodCodingSystem,code:$methodCodingCode})
              MERGE(m)-[:specimen{refernce:$specimenReference,type:$specimenType}]->(:specimenIdentifier{system:$specimenIdentifierSystem,value:$specimenIdentifierValue})
              MERGE(m)-[:device{refernce:$deviceReference,type:$deviceType}]->(:deviceIdentifier{system:$deviceIdentifierSystem,value:$deviceIdentifierValue})
              MERGE(m)-[:referenceRange{text:$referenceRangeText}]->(:referenceRange{lowValue:$referenceRangeLowValue,lowComparator:$referenceRangeLowComparator,highValue:$referenceRangeHighValue,highComparator:$referenceRangeHighComparator,ageLowValue:$referenceRangeAgeLowValue,ageLowComparator:$referenceRangeAgeLowComparator,ageHighValue:$referenceRangeAgeHighValue,ageHighComparator:$referenceRangeAgeHighComparator})
              MERGE(m)-[:hasMember{reference:$hasMemberReference,type:$hasMemberType}]-(:hasMemberIdentifier{system:$hasMemberIdentifierSystem,value:$hasMemberIdentifierValue})
              MERGE(m)-[:derivedFrom{reference:$derivedFromReference,type:$derivedFromType}]-(:derivedFromIdentifier{system:$derivedFromIdentifierSystem,value:$derivedFromIdentifierValue})
              MERGE(m)-[:component{}]->(a:component{})-[:compnentCoding{text:$componentCodeText}]->(:componentCode{system:$componentCodeCodingSystem,code:$componentCodeCodingCode})
              MERGE(a)-[:componentDataAbsentReason{text:$componentDataAbsentReasonText}]->(:dataAbsentcoding{system:$componentDataAbsentReasonCodingSystem,code:$componentDataAbsentReasonCodingCode})
              MERGE(a)-[:componentInterpretation{text:$componentInterpretationText}]->(:coding{system:$componentInterpretationCodingSystem,code:$componentInterpretationCodingCode})
              `;
  session
    .run(query, params)
    .then(() => {
      console.log("data uploaded");
      console.log({ message: "data upload sucessfull" });
    })
    .catch((err) => next(err));
}

var next = (err) => {
  console.log(err);
};

// historyTodatabase(medicalData, next);
