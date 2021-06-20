var driver = require("./../database");
var path = require("path");
var multer = require("multer");

exports.getReport = async (req, res, next) => {
  try {
    res.sendFile(
      `${path.resolve()}\\public\\medicalReports\\${req.query.id}\\${
        req.query.reportName
      }`
    );
  } catch (err) {
    next(err);
  }
};

exports.addReport = async (req, res, next) => {
  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
        // A Multer error occurred when uploading.
      } else if (err) {
        return res.status(500).json(err);
        // An unknown error occurred when uploading.
      }
      return res.status(200).send(req.files);
      // Everything went fine.
    });
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
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("file");

exports.changeReport = (req, res, next) => {
  res.send(req.body);
};

async function historyTodatabase(reportObj, next) {
  var session = driver.session();
  var params = reportObj;
  var query = `MATCH(n:Patient{value:$id})
              MERGE(n)-[:medicalHistroy{use:$identifierUse,identifierSystem:$identifierSystem,identifierValue:$identifierValue}]->(m:observation{system:$identifierCodingSystem,code:$identifierCodingCode})
              MERGE(m)-[:basedOn]->(q:basedOn{reference:$basedOnReference,type:$basedOnType,display:$basedOnDisplay})
              MERGE(q)-[:basedOnIdentifies{use:$basedOnIdentifierUse,system:$basedOnIdentifierSystem,value:$basedOnIdentifiervalue}]->(:coding{system:$basedOnIdentifierCodingSystem,code:$basedOnIdentifierCodingCode})
              MERGE(m)-[:partOf{}]->(:partOf{referrence:$partOfReference})
              MERGE(m)-[:miscellenous]->(:miscellanous{resourceType:$resourceType,status:$status,effectiveDateTime:$effectiveDateTime,issued:$issued})
              MERGE(m)-[:category{text:$categoryText}]->(:coding{coding:$categoryCoding})
              MERGE(m)-[:code{text:$codeText}]->(:coding{system:$codeCodingSystem,code:$codeCodingCode,display:$codeCodingDisplay})
              MERGE(m)-[:belongsTo{value:$subjectIdentifierValue}]->(:subject{reference:$subjectReference,type:$subjectType,display:$subjectDisplay})
              MERGE(m)-[:focus]->(:focus{refernce:$focusRefernce})
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

var medicalData = {
  id: "20000618-135553",
  identifierUse: "aadd",
  identifierSystem: "aadd",
  identifierValue: "aadd",
  identifierCodingSystem: "aadd",
  identifierCodingCode: "aadd",
  basedOnReference: "aadd",
  basedOnType: "aadd",
  basedOnDisplay: "aadd",
  basedOnIdentifierUse: "aadd",
  basedOnIdentifierSystem: "aadd",
  basedOnIdentifiervalue: "aadd",
  basedOnIdentifierCodingSystem: "aadd",
  basedOnIdentifierCodingCode: "aadd",
  partOfReference: "aadd",
  resourceType: "aadd",
  status: "aadd",
  effectiveDateTime: "aadd",
  issued: "aadd",
  categoryText: "aadd",
  categoryCoding: "aadd",
  codeText: "aadd",
  codeCodingSystem: "aadd",
  codeCodingCode: "aadd",
  codeCodingDisplay: "aadd",
  subjectIdentifierValue: "aadd",
  subjectReference: "aadd",
  subjectDisplay: "aadd",
  subjectType: "aadd",
  focusRefernce: "aadd",
  encounterIdentifierValue: "aadd",
  encounterReference: "aadd",
  encounterType: "aadd",
  encounterDisplay: "aadd",
  performerIdentifierValue: "aadd",
  performerReference: "aadd",
  performerType: "aadd",
  performerDisplay: "aadd",
  dataAbsentReasonText: "aadd",
  dataAbsentReasonCodingSystem: "aadd",
  dataAbsentReasonCodingCode: "aadd",
  interpretationText: "aadd",
  interpretationCodingSystem: "aadd",
  interpretationCodingCode: "aadd",
  noteAuthorString: "aadd",
  authorReferenceReference: "aadd",
  authorReferenceType: "aadd",
  noteAuthorReferenceIdentifierSystem: "aadd",
  noteAuthorReferenceIdentifierValue: "aadd",
  bodySiteText: "aadd",
  noteTime: "aadd",
  noteText: "aadd",
  bodySiteCodingSystem: "aadd",
  bodySiteCodingCode: "aadd",
  methodText: "aadd",
  methodCodingSystem: "aadd",
  methodCodingCode: "aadd",
  specimenReference: "aadd",
  specimenType: "aadd",
  specimenIdentifierSystem: "aadd",
  specimenIdentifierValue: "aadd",
  deviceReference: "aadd",
  deviceType: "aadd",
  deviceIdentifierSystem: "aadd",
  deviceIdentifierValue: "aadd",
  referenceRangeText: "aadd",
  referenceRangeLowValue: "aadd",
  referenceRangeLowComparator: "aadd",
  referenceRangeHighValue: "aadd",
  referenceRangeHighComparator: "aadd",
  referenceRangeAgeLowValue: "aadd",
  referenceRangeAgeLowComparator: "aadd",
  referenceRangeAgeHighValue: "aadd",
  referenceRangeAgeHighComparator: "aadd",
  hasMemberReference: "aadd",
  hasMemberType: "aadd",
  hasMemberIdentifierSystem: "aadd",
  hasMemberIdentifierValue: "aadd",
  derivedFromReference: "aadd",
  derivedFromType: "aadd",
  derivedFromIdentifierSystem: "aadd",
  derivedFromIdentifierValue: "aadd",
  componentCodeCodingSystem: "aadd",
  componentCodeCodingCode: "aadd",
  componentCodeText: "aadd",
  componentDataAbsentReasonText: "aadd",
  componentDataAbsentReasonCodingSystem: "aadd",
  componentDataAbsentReasonCodingCode: "aadd",
  componentInterpretationCodingSystem: "aadd",
  componentInterpretationCodingCode: "aadd",
  componentInterpretationText: "aadd",
};

var next = (err) => {
  console.log(err);
};
// historyTodatabase(medicalData, next);
