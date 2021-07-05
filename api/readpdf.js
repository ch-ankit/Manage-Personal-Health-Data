const fs = require("fs");
var path = require("path");
var pdfReader = require("pdfreader");
var y;
var text;

fs.readFile(`${path.resolve()}//public//ReportSample.pdf`, (err, pdfBuffer) => {
  // pdfBuffer contains the file content
  new pdfReader.PdfReader().parseBuffer(pdfBuffer, function (err, item) {
    if (err) console.log(err);
    else if (!item){
      console.log(text); 
      console.log("1")
    }
    else if (item.text){
      if(text===undefined){
        text=item.text;
      }
      else if(y===item.y){
        text= text + item.text;  
      }
      else{
        console.log(text);
        text=item.text;
      }
      
      y=item.y;
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
