var driver = require("../database");
var path = require("path");
var multer = require("multer");
const fs = require("fs");
var pdfReader = require("pdfreader");

exports.getTouploadReport = async (req, res, next) => {
  var query = `MATCH(n:Patient{value:"${req.query.id}"})-[r:medicalRecord]->(m:masterIdentifier{value:"${req.query.masterIdentifier}"})-[:hasReport{}]->(m1)-[r1:type]->(:coding)
  RETURN m.value,m1,r1`;
  var session = driver.session();
  session
    .run(query)
    .then((result) => {
      console.log(result.records.length);
      var data = result.records.map((el) => {
        var returnData = {};
        returnData.filename = el._fields[0];
        returnData.value = el._fields[1].properties.value;
        returnData.text = el._fields[2].properties.text;
        return returnData;
      });
      // console.log(data);
      res.send(data);
    })
    .catch((err) => next(err));
};

exports.getReport = async (req, res, next) => {
  try {
    res.sendFile(
      `${path.resolve()}//public//medicalReports//${req.query.id}//${
        req.query.masterId
      }//${req.query.reportName}`
    );
  } catch (err) {
    console.log(err);
  }
};

exports.checkReport = async (req, res, next) => {
  var session = driver.session();
  session
    .run(
      `MATCH(n:Patient{value:"${req.query.id}"})-[r:medicalRecord{}]->(n1:masterIdentifier{value:"${req.query.masterId}"})-[:hasReport{}]-(m:reportIdentifier{value:"${req.query.reportId}"})-[r1:basedOn]->() return r1`
    )
    .then((result) => {
      if (result.records[0]) {
        res.send({ message: "report available" });
      } else {
        res.send({ message: "report not available" });
      }
    })
    .catch((err) => next(err));
};

exports.addReport = async (req, res, next) => {
  try {
    var patientId;
    var masterId;
    var reportId;
    var reportFileName;
    upload(req, res, function (err) {
      console.log(req.body);
      patientId = req.body.id;
      masterId = req.body.masterId;
      reportId = req.body.reportId;
      reportFileName = `${req.body.reportId}.pdf`;
      if (err instanceof multer.MulterError) {
        return res.status(500).send({
          message: "A Multer error occurred when uploading.,Try Again ",
        });
        // A Multer error occurred when uploading.
      } else if (err) {
        return res.status(500).send({
          message: "An unknown error occurred when uploading,Try Again ",
        });
        // An unknown error occurred when uploading.
      }

      return res.status(200).send({ message: "upload successfull" });
      // Everything went fine.
    });
    setTimeout(() => {
      var y;
      var text;
      var reportData = "";
      var isTable = false;
      var rowData = [];
      var tableData = [];
      var medicalData = {
        identifierUse: "official",
        identifierSystem: "MasterId-Report Category Code CV",
        identifierCodingSystem: "link link link",
        identifierCodingCode: "Some abbr",
        basedOnReference: "--",
        basedOnType: "--",
        basedOnDisplay: "--",
        basedOnIdentifierUse: "--",
        basedOnIdentifierSystem: "--",
        basedOnIdentifiervalue: "--",
        basedOnIdentifierCodingSystem: "--",
        basedOnIdentifierCodingCode: "--",
        partOfReference: "--",
        partOfIdentifierSystem: "link link link",
        partOfIdentifierValue: "--",
        partOfDisplay: "--",
        resourceType: "Observation",
        categoryText: "--", //thapna baki fetch garne time vayema
        categoryCodingCode: "---",
        categoryCodingSystem: "---",
        categoryCodingDisplay: " ",
        codeText: "--",
        codeCodingSystem: "--",
        codeCodingDisplay: "--",
        subjectReference: "link to patient profile",
        subjectDisplay: "--",
        subjectType: "--",
        encounterIdentifierValue: "--",
        encounterReference: "--",
        encounterType: "--",
        encounterDisplay: "--",
        performerReference: "--",
        performerType: "Practitioner",
        dataAbsentReasonText: "--",
        dataAbsentReasonCodingSystem: "--",
        dataAbsentReasonCodingCode: "**",
        interpretationText: "--",
        interpretationCodingSystem: "--",
        interpretationCodingCode: "--",
        noteAuthorString: "--",
        authorReferenceReference: "--",
        authorReferenceType: "--",
        noteAuthorReferenceIdentifierSystem: "--",
        noteAuthorReferenceIdentifierValue: "--",
        bodySiteText: "--",
        noteTime: "--",
        noteText: "--",
        bodySiteCodingSystem: "--",
        bodySiteCodingCode: "--",
        methodText: "--",
        methodCodingSystem: "--",
        methodCodingCode: "--",
        specimenReference: "--",
        specimenType: "--",
        specimenIdentifierSystem: "--",
        deviceType: "--",
        deviceIdentifierSystem: "--",
        deviceIdentifierValue: "--",
        referenceRangeLowValue: "**",
        referenceRangeLowComparator: "**",
        referenceRangeHighValue: "**",
        referenceRangeHighComparator: "**",
        referenceRangeAgeLowValue: "**",
        referenceRangeAgeLowComparator: "**",
        referenceRangeAgeHighValue: "**",
        referenceRangeAgeHighComparator: "**",
        hasMemberReference: "--",
        hasMemberType: "--",
        hasMemberIdentifierSystem: "--",
        hasMemberIdentifierValue: "--",
        derivedFromReference: "--",
        derivedFromType: "--",
        derivedFromIdentifierSystem: "--",
        componentCodeCodingSystem: "--",
        componentCodeCodingCode: "--",
        componentCodeText: "--",
        componentDataAbsentReasonText: "--",
        componentDataAbsentReasonCodingSystem: "--",
        componentDataAbsentReasonCodingCode: "--",
        componentInterpretationCodingSystem: "--",
        componentInterpretationCodingCode: "--",
        componentInterpretationText: "--",
      };
      fs.readFile(
        `${path.resolve()}//public//medicalReports//${patientId}//${masterId}//${reportFileName}`,
        (err, pdfBuffer) => {
          // pdfBuffer contains the file content
          if (!err) {
            new pdfReader.PdfReader().parseBuffer(
              pdfBuffer,
              function (err, item) {
                if (err) console.log(err);
                else if (!item) {
                  // console.log(text);
                  if (isTable === true) {
                    tableData.push(rowData);
                    rowData = [];
                  }
                  // //console.log(tableData);
                  reportData = reportData + text;
                  //console.log(reportData);
                  reportData.replace(/\r\n/g, " ");
                  medicalData.masterIdentifierValue = masterId;
                  medicalData.deviceReference =
                    /Device Reference:\s(.*?)Medical/i.exec(reportData)[1];
                  medicalData.reportIdentifierValue = reportId;
                  // /Report Id:\s(.*?)Master ReportId:/i.exec(reportData)[1];
                  medicalData.derivedFromIdentifierValue = masterId;
                  medicalData.subjectIdentifierValue = patientId;
                  medicalData.effectiveDateTime =
                    /Date:\s(.*?)Report Type:/i.exec(reportData)[1];
                  medicalData.issued = /Date:\s(.*?)Report Type:/i.exec(
                    reportData
                  )[1];
                  medicalData.partOfType = /Report\s(.*?)Reference:/i
                    .exec(reportData)[1]
                    .split("Type:")
                    .pop();
                  medicalData.referenceRangeText =
                    /TestReference:\s(.*?)Status:/i.exec(reportData)[1];
                  medicalData.status = /Status:\s(.*?)Category:/i.exec(
                    reportData
                  )[1];
                  medicalData.categoryCoding = /Category:\s(.*?)Code:/i.exec(
                    reportData
                  )[1];
                  medicalData.codeCodingCode = /Code:\s(.*?)Focus:/i.exec(
                    reportData
                  )[1];
                  medicalData.focusReference = /Focus:\s(.*?)Specimen:/i.exec(
                    reportData
                  )[1];
                  medicalData.specimenIdentifierValue =
                    /Specimen:\s(.*?)Performed By:/i.exec(reportData)[1];
                  medicalData.performerIdentifierValue =
                    /Performed By:\s(.*?)S./i.exec(reportData)[1].slice(0, 7);
                  medicalData.performerDisplay = /Performed By:\s(.*?)Bio/i
                    .exec(reportData)[1]
                    .slice(7)
                    .replace("S.No.", "");
                  console.log(medicalData);
                  historyTodatabase(medicalData, next);
                } else if (item.text) {
                  if (text === undefined) {
                    text = item.text;
                  } else if (y === item.y) {
                    if (isTable == true) {
                      rowData.push(item.text);
                    }
                    text = text + item.text;
                  } else {
                    if (isTable === true) {
                      tableData.push(rowData);
                      rowData = [];
                    }
                    // console.log(text);
                    if (text.includes("S.No.")) {
                      isTable = true;
                    }
                    reportData = reportData + text;
                    text = item.text;
                  }

                  y = item.y;
                }
              }
            );
          } else {
            next(err);
          }
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
    console.log(req.body.masterId);
    cb(null, `public//medicalReports//${req.body.id}//${req.body.masterId}`);
  },
  filename: function (req, file, cb) {
    var reportFileName = `${req.body.reportId}.pdf`;
    cb(null, reportFileName);
  },
});

const upload = multer({ storage: storage }).array("file");

async function historyTodatabase(reportObj, next) {
  var session = driver.session();
  var params = reportObj;
  console.log(params.subjectIdentifierValue);
  console.log(params.masterIdentifierValue);
  console.log(params.reportIdentifierValue);
  var query = `MATCH(n:Patient{value:$subjectIdentifierValue})-[r:medicalRecord{}]->(n1:masterIdentifier{value:$masterIdentifierValue})-[:hasReport{}]-(m:reportIdentifier{value:$reportIdentifierValue})
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
              return n
              `;
  session
    .run(query, params)
    .then((result) => {
      console.log(result.records);
      console.log({ message: "data upload sucessfull" });
    })
    .catch((err) => next(err));
}
