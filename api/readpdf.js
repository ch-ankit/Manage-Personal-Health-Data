const fs = require("fs");
var path = require("path");
var pdfReader = require("pdfreader");
var y;
var text;
var reportData = "";
var medicalData = {};

fs.readFile(`${path.resolve()}//public//ReportSample.pdf`, (err, pdfBuffer) => {
  // pdfBuffer contains the file content
  new pdfReader.PdfReader().parseBuffer(pdfBuffer, function (err, item) {
    if (err) console.log(err);
    else if (!item) {
      // console.log(text);
      reportData = reportData + text;
      console.log(reportData);
      reportData.replace(/\r\n/g, " ");
      medicalData.deviceReference = /Device Reference:\s(.*?)Medical/i.exec(
        reportData
      )[1];
      medicalData.identifierValue = /Report Id:\s(.*?)Master ReportId:/i.exec(
        reportData
      )[1];
      medicalData.derivedFromIdentifierValue =
        /Master ReportId:\s(.*?)Patient Id:/i.exec(reportData)[1];
      medicalData.subjectIdentifierValue = /Patient\s(.*?)Date:/i
        .exec(reportData)[1]
        .slice(3);
      medicalData.effectiveDateTime = /Date:\s(.*?)Report Type:/i.exec(
        reportData
      )[1];
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
    } else if (item.text) {
      if (text === undefined) {
        text = item.text;
      } else if (y === item.y) {
        text = text + item.text;
      } else {
        // console.log(text);
        reportData = reportData + text;
        text = item.text;
      }

      y = item.y;
    }
  });
});

// new pdfReader().parseFileItems(
//   `${path.resolve()}\\public\\ReportSample.pdf`,
//   function (err, item) {
//     if (err) callback(err);
//     else if (!item) callback();
//     else if (item.text) console.log(item.text);
//   }
// );

// fs.readFile(`${path.resolve()}\\public\\ReportSample.pdf`, (err, data) => {
//   if (err) console.log(err);
//   else {
//     console.log(data);
//     // const x = data.split("\r");
//     // console.log(x);
//   }
// });
