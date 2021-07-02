const fs = require("fs");
var path = require("path");
var pdfReader = require("pdfreader");

fs.readFile(`${path.resolve()}\\public\\ReportSample.pdf`, (err, pdfBuffer) => {
  // pdfBuffer contains the file content
  new pdfReader.PdfReader().parseBuffer(pdfBuffer, function (err, item) {
    if (err) console.log(err);
    else if (!item) console.log("1");
    else if (item.text) console.log(item.text);
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
