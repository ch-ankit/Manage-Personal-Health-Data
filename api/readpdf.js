const fs = require("fs");
var path = require("path");
var pdfReader = require("pdfreader");
const csv = require("csv-parser");
var driver = require("./database");

// var y;
// var text;
// var reportData = "";
// var medicalData = {
//   resourceType: "DocumentReference",
//   masterIdentifier: {
//     use: "official",
//     type: {
//       coding: [
//         {
//           system:
//             "url of system which defines what is used by our system to generate this value ofidentifier : PatientId-CreatedDate",
//           code: "PID-DATE",
//         },
//       ],
//       text: "Patient id and the date the document was created is used to generate the masterIdentifier",
//     },
//     system: "url of our system which generates this value",
//     value:
//       "Identifier value for this version of the document. This master identifier is used for this specific version of the document another version has seperate master identifier but can have the same identifier",
//   },
//   identifier: [
//     {
//       use: "official",
//       type: {
//         coding: [
//           {
//             system:
//               "url of system which defines what is used by our system to generate this value ofidentifier : PatientId-CreatedDate",
//             code: "PID-DATE",
//           },
//         ],
//         text: "Patient id and the date the document was created is used to generate the identifier",
//       },
//       system: "url of our system which generates this value",
//       value: "value of the identifier",
//     },
//   ],
//   status: " preliminary | final | amended | entered-in-error",
//   type: {
//     coding: [
//       {
//         system:
//           "://www.hl7.org/fhir/valueset-c80-doc-typecodes.html| ://loinc.org",
//         code: "55107-7. This is in the url very long list",
//       },
//     ],
//     text: "Addendum Document",
//   },
//   category: [
//     {
//       coding: [
//         {
//           system: "://:3000/DocumentCategorySet",
//           code: "History and Physical",
//           display: "History and Physical",
//         },
//       ],
//     },
//   ],
//   subject: {
//     reference: "url of patient",
//     type: "Patient",
//     identifier: {
//       system: "patient identifier generator systme url ",
//       value: "patientId",
//     },
//     display: "Patient Name",
//   },
//   date: "YYYY-M-::ss.ss+:zz <instant this document was created>",
//   author: [
//     {
//       reference: "url of practitioner",
//       type: "Practitioner",
//       identifier: {
//         system: "Practitioner identifier generator systme url // NMC url",
//         value: "practitionerId",
//       },
//       display: "Name of Practitioner",
//     },
//   ],
//   authenticator: {
//     reference:
//       "url of practitioner who autheticated this document can be same as above in our case",
//     type: "Practitioner",
//     identifier: {
//       system: "Practitioner identifier generator systme url // NMC url",
//       value: "practitionerId",
//     },
//     display: "Name of Practitioner",
//   },
//   custodian: {
//     reference:
//       "Our app so we are the organizationn maitaining the document so our url",
//     type: "Organization",
//     identifier: {
//       system: "who gives organization id that system url",
//       value: "organizationID",
//     },
//     display: "Managing Personal Health Data",
//   },
//   relatesTo: [
//     {
//       code: "appends|replaces|signs",
//       target: {
//         reference: "url of referenced report",
//         identifier: {
//           system: "url of system where report is present",
//           value: "12345",
//         },
//         display: "Regular CheckUp Reprot",
//       },
//     },
//   ],
//   description: "<string descriptio  of the report>",
//   securityLabel: [
//     {
//       coding: [
//         {
//           system: "url",
//           code: "S",
//         },
//       ],
//       text: "Cleared for sharing report",
//     },
//   ],
//   content: [
//     {
//       attachment: {
//         contentType: "*/pdf",
//         language: "en",
//         data: "",
//         url: "",
//         size: 0,
//         hash: "",
//         title: "",
//         creation: "<dateTime>",
//       },
//       format: {
//         system: "",
//         code: "",
//         display: "",
//       },
//     },
//   ],
//   context: {
//     encounter: [
//       {
//         reference: "url of encounter",
//         identifier: {
//           system: "",
//           value: "",
//         },
//         display: "",
//       },
//     ],
//     event: [
//       {
//         coding: [
//           {
//             system: "url for codes",
//             code: "T-D8200",
//             display: "Arm",
//           },
//         ],
//         text: "Arm pain problem",
//       },
//     ],
//     period: {
//       start: "<dateTime>",
//       end: "<dateTime>",
//     },
//     facilityType: {
//       coding: [
//         {
//           system: "url of system for codes",
//           code: "OPD",
//           display: "",
//         },
//       ],
//       text: "Out patient department",
//     },
//     practiceSetting: {
//       coding: [
//         {
//           system: "url for codes",
//           code: "General Medicine",
//           display: "",
//         },
//       ],
//       text: "General medicine",
//     },
//     sourcePatientInfo: {
//       reference: "url of patient",
//       identifier: {
//         system: "",
//         value: "PatientID",
//       },
//       display: "",
//     },
//     related: [
//       {
//         reference: "url of related observation/report/documents",
//         identifier: {
//           system: "",
//           value: "",
//         },
//         display: "Realted to this document",
//       },
//     ],
//   },
// };

// fs.readFile(
//   `${path.resolve()}//public//Observation_Report_1.pdf`,
//   (err, pdfBuffer) => {
//     // pdfBuffer contains the file content
//     new pdfReader.PdfReader().parseBuffer(
//       pdfBuffer,
//       async function (err, item) {
//         if (err) console.log(err);
//         else if (!item) {
//           // console.log(text);
//           reportData = reportData + text;
//           reportData.replace(/\r|\n/g, " ");
//           console.log(reportData);
//           medicalData.custodian.display = `${
//             reportData.split("HOSPITAL")[0]
//           }HOSPITAL`;
//           //console.log(medicalData.custodian.display);
//           medicalData.masterIdentifier.value =
//             /Date Time:\s(.*?)Name of Doctor/i
//               .exec(reportData)[1]
//               .replace(/ - /g, "-");
//           // console.log(medicalData.masterIdentifier.value);
//           medicalData.status = /Report Status:\s(.*?)Date/i.exec(reportData)[1];
//           //console.log(medicalData.status);
//           medicalData.subject.identifier.value =
//             /PatientId:\s(.*?)Patient Name/i.exec(reportData)[1];
//           // var query = `MATCH (n:Patient{value:"20000101-633940"})-[:hasName]-(m) RETURN m`;
//           // var params = {
//           //   value: medicalData.subject.identifier.value,
//           // };
//           // var session = driver.session();
//           // medicalData.subject.display = await session
//           //   .run(query, params)
//           //   .then((result) => {
//           //     var nameObj = result.records[0]._fields[0].properties;
//           //     var name = `${nameObj.prefix}.${nameObj.given[0]} ${
//           //       nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
//           //     }${nameObj.family}${
//           //       nameObj.suffix == "" ? "" : `,${nameObj.suffix}`
//           //     }`;
//           //     return name;
//           //   });
//           medicalData.subject.display = /Patient Name:\s(.*?)Age/i.exec(
//             reportData
//           )[1];
//           //console.log(medicalData.subject);
//           medicalData.context.sourcePatientInfo = medicalData.subject;
//           delete medicalData.context.sourcePatientInfo.type;
//           //console.log(medicalData.sourcePatientInfo);
//           medicalData.date = /Date Time:\s(.*?)Name of/i
//             .exec(reportData)[1]
//             .replace(/ - /g, "-");
//           //console.log(medicalData.date);
//           medicalData.author[0].identifier.value =
//             /NMC No:\s(.*?)Allergy/i.exec(reportData)[1];
//           medicalData.author[0].display = /Name of Doctor:\s(.*?)MBBS/i.exec(
//             reportData
//           )[1];
//           //console.log(medicalData.author);
//           medicalData.authenticator = medicalData.author[0];
//           //console.log(medicalData.authenticator);
//           medicalData.description = /Comments\s(.*?)Tests to be performed/i
//             .exec(reportData)[1]
//             .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
//             .split(`.`)
//             .join();
//           //console.log(medicalData.description);
//           medicalData.content[0].attachment.creation =
//             /Date Time:\s(.*?)Name of/i
//               .exec(reportData)[1]
//               .replace(/ - /g, "-");
//           medicalData.content[0].attachment.title =
//             /Record Type:\s(.*?)Category/i
//               .exec(reportData)[1]
//               .replace(/ - /g, "-")
//               .trim();
//           // console.log(medicalData.content);
//           medicalData.context.event[0].coding[0].code =
//             /Body Site:\s(.*?)Record Type/i.exec(reportData)[1];
//           // console.log(medicalData.context.event[0].coding);
//           medicalData.category[0].coding[0].code =
//             /Category:\s(.*?) Report Status/i.exec(reportData)[1];
//           // console.log(medicalData.category[0].coding[0]);
//           medicalData.type.text = /Record Type:\s(.*?)Category/i
//             .exec(reportData)[1]
//             .replace(/ - /g, "-")
//             .trim();
//           medicalData.context.period.start = reportData.substring(
//             reportData.indexOf("Onset:") + 7,
//             reportData.indexOf("Onset:") + 17
//           );
//           //console.log(medicalData.context.period.start);
//           var x = /Tests to be Performed\s(.*?)Prescriptions/i
//             .exec(reportData)[1]
//             .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
//             .replace(/ - /g, "-")
//             .split(".");
//           x = x.map((str) => str.trim());
//           medicalData.symptoms = reportData
//             .substring(reportData.indexOf("Onset:") + 17)
//             .split(`${medicalData.custodian.display}`)[0]
//             .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
//             .split(".");
//           medicalData.symptoms = medicalData.symptoms.map((str) => str.trim());
//           medicalData.prescriptions = reportData
//             .substring(reportData.indexOf("Prescriptions") + 14)
//             .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
//             .split(".");
//           medicalData.prescriptions = medicalData.prescriptions.map((str) =>
//             str.trim()
//           );
//           //console.log(medicalData.prescriptions);
//           medicalData.toReport = {};
//           medicalData.toReport.allergy = /Allergy\s(.*?)Vital/i
//             .exec(reportData)[1]
//             .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
//             .split(".");

//           medicalData.toReport.Pulse = /Pulse:\s(.*?)per min/i.exec(
//             reportData
//           )[1];

//           medicalData.toReport.Temperature = /Temperature:\s(.*?)F/i.exec(
//             reportData
//           )[1];

//           medicalData.toReport.Height = /Height:\s(.*?)cms/i.exec(
//             reportData
//           )[1];
//           medicalData.toReport.Weight = /Weight:\s(.*?)kgs/i.exec(
//             reportData
//           )[1];
//           medicalData.toReport.BMI = /BMI:\s(.*?)SPO2/i.exec(reportData)[1];
//           medicalData.toReport.SPO2 = /SPO2:\s(.*?)percentage/i.exec(
//             reportData
//           )[1];
//           medicalData.toReport.Respiration = /Respiration:\s(.*?)per min/i.exec(
//             reportData
//           )[1];
//           medicalData.toReport.Systolic = /Systolic:\s(.*?) Diastolic/i.exec(
//             reportData
//           )[1];
//           medicalData.toReport.Diastolic = / Diastolic:\s(.*?)Symptoms/i.exec(
//             reportData
//           )[1];
//           console.log(medicalData.toReport);
//           var testcode = [];

//           fs.createReadStream("data.csv")
//             .pipe(csv())
//             .on("data", (row) => {
//               if (x.includes(row.Common_Name)) {
//                 testcode.push(row.Code);
//               }
//             })
//             .on("end", () => {
//               medicalData.identifier[0].value = testcode;
//               console.log(medicalData);
//             });
//         } else if (item.text) {
//           if (text === undefined) {
//             text = item.text;
//           } else if (y === item.y) {
//             text = text + item.text;
//           } else {
//             // console.log(text);
//             reportData = `${reportData} ${text}`;
//             text = item.text;
//           }
//           y = item.y;
//         }
//       }
//     );
//   }
// );

// pdfParser.loadPDF("./public/ReportSample.pdf");

// fs.readFile(`${path.resolve()}\\public\\ReportSample.pdf`, async (err, pdfBuffer) => {
//   let pdfParser = new PDFParser(this, 1);
//   pdfParser.on("pdfParser_dataError", errData => console.log(errData.parseError));
//   // console.log(pdfBuffer)
//   pdfParser.on("pdfParser__dataReady", pdfData => {
//     console.log(pdfData)
//     console.log(`"extractedData":${pdfParser.getRawTextContent()}`)
//   })
//   pdfParser.loadPDF(`${path.resolve()}\\public\\ReportSample.pdf`)
// })

// fs.readFile(`${path.resolve()}\\public\\ReportSample.pdf`, (err, pdfBuffer) => {
//   var processItem = Rule.makeItemProcessor([
//     Rule.on(/^Device Reference: \"(.*)\"$/)
//       .extractRegexpValues()
//       .then(items => console.log(items)),
//     Rule.on(/^Value\:/)
//       .parseNextItemValue()
//       .then(items => console.log(items)),
//     Rule.on(/^c1$/).parseTable(3).then(items => console.log(items)),
//     Rule.on(/^Values\:/)
//       .accumulateAfterHeading()
//       .then(items => console.log(items)),
//   ]);
//   // pdfBuffer contains the file content
//   new pdfReader.PdfReader().parseBuffer(pdfBuffer, function (err, item) {
//     processItem(item)
//     if (err) console.log(err);
//     else if (!item) console.log("1");
//     else if (item.text) console.log(item.text);
//   });
// });

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
fs.readFile(`${path.resolve()}//public//ReportSample.pdf`, (err, pdfBuffer) => {
  // pdfBuffer contains the file content
  new pdfReader.PdfReader().parseBuffer(pdfBuffer, function (err, item) {
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
      medicalData.deviceReference = /Device Reference:\s(.*?)Medical/i.exec(
        reportData
      )[1];
      medicalData.identifierValue = /Report Id:\s(.*?)Master ReportId:/i.exec(
        reportData
      )[1];
      medicalData.derivedFromIdentifierValue =
        /Master ReportId:\s(.*?)Patient Id:/i.exec(reportData)[1];
      medicalData.subjectIdentifierValue =
        "20000101-687825"; /*/Patient\s(.*?)Date:/i
            .exec(reportData)[1]
            .slice(3);*/
      medicalData.effectiveDateTime = /Date:\s(.*?)Report Type:/i.exec(
        reportData
      )[1];
      medicalData.issued = /Date:\s(.*?)Report Type:/i.exec(reportData)[1];
      medicalData.partOfType = /Report Type:\s(.*?)Reference:/i.exec(
        reportData
      )[1];
      medicalData.referenceRangeText = /TestReference:\s(.*?)Status:/i.exec(
        reportData
      )[1];
      medicalData.status = /Status:\s(.*?)Category:/i.exec(reportData)[1];
      medicalData.categoryCoding = /Category:\s(.*?)Code:/i.exec(reportData)[1];
      medicalData.codeCodingCode = /Code:\s(.*?)Focus:/i.exec(reportData)[1];
      medicalData.focusReference = /Focus:\s(.*?)Specimen:/i.exec(
        reportData
      )[1];
      medicalData.specimenIdentifierValue =
        /Specimen:\s(.*?)Performed By:/i.exec(reportData)[1];
      medicalData.performerIdentifierValue = /Performed By:\s(.*?)S./i
        .exec(reportData)[1]
        .slice(0, 7);
      medicalData.performerDisplay = /Performed By:\s(.*?)Bio/i
        .exec(reportData)[1]
        .slice(7)
        .replace("S.No.", "");
      console.log(medicalData);
      //historyTodatabase(medicalData, next);
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

        if (text.includes("S.No.")) {
          isTable = true;
        }
        reportData = reportData + text;
        text = item.text;
      }

      y = item.y;
    }
  });
});
