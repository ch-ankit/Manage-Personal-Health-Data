const fs = require("fs");
var path = require("path");
var pdfReader = require("pdfreader");
var y;
var text;
var reportData = "";
var medicalData = {
  resourceType: "DocumentReference",
  masterIdentifier: {
    use: "official",
    type: {
      coding: [
        {
          system:
            "url of system which defines what is used by our system to generate this value ofidentifier : PatientId-CreatedDate",
          code: "PID-DATE",
        },
      ],
      text: "Patient id and the date the document was created is used to generate the masterIdentifier",
    },
    system: "url of our system which generates this value",
    value:
      "Identifier value for this version of the document. This master identifier is used for this specific version of the document another version has seperate master identifier but can have the same identifier",
  },
  identifier: [
    {
      use: "official",
      type: {
        coding: [
          {
            system:
              "url of system which defines what is used by our system to generate this value ofidentifier : PatientId-CreatedDate",
            code: "PID-DATE",
          },
        ],
        text: "Patient id and the date the document was created is used to generate the identifier",
      },
      system: "url of our system which generates this value",
      value: "value of the identifier",
    },
  ],
  status: " preliminary | final | amended | entered-in-error",
  type: {
    coding: [
      {
        system:
          "://www.hl7.org/fhir/valueset-c80-doc-typecodes.html| ://loinc.org",
        code: "55107-7. This is in the url very long list",
      },
    ],
    text: "Addendum Document",
  },
  category: [
    {
      coding: [
        {
          system: "://:3000/DocumentCategorySet",
          code: "History and Physical",
          display: "History and Physical",
        },
      ],
    },
  ],
  subject: {
    reference: "url of patient",
    type: "Patient",
    identifier: {
      system: "patient identifier generator systme url ",
      value: "patientId",
    },
    display: "Patient Name",
  },
  date: "YYYY-M-::ss.ss+:zz <instant this document was created>",
  author: [
    {
      reference: "url of practitioner",
      type: "Practitioner",
      identifier: {
        system: "Practitioner identifier generator systme url // NMC url",
        value: "practitionerId",
      },
      display: "Name of Practitioner",
    },
  ],
  authenticator: {
    reference:
      "url of practitioner who autheticated this document can be same as above in our case",
    type: "Practitioner",
    identifier: {
      system: "Practitioner identifier generator systme url // NMC url",
      value: "practitionerId",
    },
    display: "Name of Practitioner",
  },
  custodian: {
    reference:
      "Our app so we are the organizationn maitaining the document so our url",
    type: "Organization",
    identifier: {
      system: "who gives organization id that system url",
      value: "organizationID",
    },
    display: "Managing Personal Health Data",
  },
  relatesTo: [
    {
      code: "appends|replaces|signs",
      target: {
        reference: "url of referenced report",
        identifier: {
          system: "url of system where report is present",
          value: "12345",
        },
        display: "Regular CheckUp Reprot",
      },
    },
  ],
  description: "<string descriptio  of the report>",
  securityLabel: [
    {
      coding: [
        {
          system: "url",
          code: "S",
        },
      ],
      text: "Cleared for sharing report",
    },
  ],
  content: [
    {
      attachment: {
        contentType: "*/pdf",
        language: "en",
        data: "",
        url: "",
        size: 0,
        hash: "",
        title: "",
        creation: "<dateTime>",
      },
      format: {
        system: "",
        code: "",
        display: "",
      },
    },
  ],
  context: {
    encounter: [
      {
        reference: "url of encounter",
        identifier: {
          system: "",
          value: "",
        },
        display: "",
      },
    ],
    event: [
      {
        coding: [
          {
            system: "url for codes",
            code: "T-D8200",
            display: "Arm",
          },
        ],
        text: "Arm pain problem",
      },
    ],
    period: {
      start: "<dateTime>",
      end: "<dateTime>",
    },
    facilityType: {
      coding: [
        {
          system: "url of system for codes",
          code: "OPD",
          display: "",
        },
      ],
      text: "Out patient department",
    },
    practiceSetting: {
      coding: [
        {
          system: "url for codes",
          code: "General Medicine",
          display: "",
        },
      ],
      text: "General medicine",
    },
    sourcePatientInfo: {
      reference: "url of patient",
      identifier: {
        system: "",
        value: "PatientID",
      },
      display: "",
    },
    related: [
      {
        reference: "url of related observation/report/documents",
        identifier: {
          system: "",
          value: "",
        },
        display: "Realted to this document",
      },
    ],
  },
};

fs.readFile(
  `${path.resolve()}//public//ObservationReport_1.pdf`,
  (err, pdfBuffer) => {
    // pdfBuffer contains the file content
    new pdfReader.PdfReader().parseBuffer(pdfBuffer, function (err, item) {
      if (err) console.log(err);
      else if (!item) {
        // console.log(text);
        reportData = reportData + " " + text;
        reportData.replace(/\r\n/g, " ");
        console.log(reportData);
        medicalData.custodian.display = `${
          reportData.split("HOSPITAL")[0]
        } Hospital`;
        medicalData.masterIdentifier.value = /Date Time:\s(.*?)Name of Doctor/i
          .exec(reportData)[1]
          .replace(/ - /g, "-");

        medicalData.identifier.value = /Tests to be performed\s(.*?)/i.exec(
          reportData
        )[1];
        var x = reportData
          .substring(reportData.indexOf("Performed 1.") + 10)
          .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
          .split(".");
        console.log(x);
        console.log(medicalData.masterIdentifier.value);
        // medicalData.derivedFromIdentifierValue =
        //   /Master ReportId:\s(.*?)Patient Id:/i.exec(reportData)[1];
        // medicalData.subjectIdentifierValue = /Patient\s(.*?)Date:/i
        //   .exec(reportData)[1]
        //   .slice(3);
        // medicalData.effectiveDateTime = /Date:\s(.*?)Report Type:/i.exec(
        //   reportData
        // )[1];
        // medicalData.partOfType = /Report Type:\s(.*?)Reference:/i.exec(
        //   reportData
        // )[1];
        // medicalData.referenceRangeText = /TestReference:\s(.*?)Status:/i.exec(
        //   reportData
        // )[1];
        // medicalData.status = /Status:\s(.*?)Category:/i.exec(reportData)[1];
        // medicalData.categoryCoding = /Category:\s(.*?)Code:/i.exec(reportData)[1];
        // medicalData.codeCodingCode = /Code:\s(.*?)Focus:/i.exec(reportData)[1];
        // medicalData.focusReference = /Focus:\s(.*?)Specimen:/i.exec(
        //   reportData
        // )[1];
        // medicalData.specimenIdentifierValue =
        //   /Specimen:\s(.*?)Performed By:/i.exec(reportData)[1];
        // medicalData.performerIdentifierValue = /Performed By:\s(.*?)S./i
        //   .exec(reportData)[1]
        //   .slice(0, 7);
        // medicalData.performerDisplay = /Performed By:\s(.*?)Bio/i
        //   .exec(reportData)[1]
        //   .slice(7)
        //   .replace("S.No.", "");
        // console.log(medicalData);
      } else if (item.text) {
        if (text === undefined) {
          text = item.text;
        } else if (y === item.y) {
          text = text + " " + item.text;
        } else {
          // console.log(text);
          reportData = reportData + " " + text;
          text = item.text;
        }

        y = item.y;
      }
    });
  }
);

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
