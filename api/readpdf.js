const fs = require("fs");
var path = require("path");
var pdfReader = require("pdfreader");
var y;
var text;

fs.readFile(`${path.resolve()}//public//ReportSample.pdf`, (err, pdfBuffer) => {
  // pdfBuffer contains the file content
  new pdfReader.PdfReader().parseBuffer(pdfBuffer, function (err, item) {
    if (err) console.log(err);
    else if (!item) {
      console.log(text);
      console.log("1")
    }
    else if (item.text) {
      if (text === undefined) {
        text = item.text;
      }
      else if (y === item.y) {
        text = text + item.text;
      }
      else {
        console.log(text);
        text = item.text;
      }

      y = item.y;
    }
  });
});

pdfParser.loadPDF('./public/ReportSample.pdf');


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
