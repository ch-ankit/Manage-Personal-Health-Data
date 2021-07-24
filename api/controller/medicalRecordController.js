var driver = require("../database");
var path = require("path");
var multer = require("multer");
const fs = require("fs");
var pdfReader = require("pdfreader");
const csv = require("csv-parser");
const mapCategoryCode = require('./../references/categoryType.js')

exports.getRecord = async (req, res, next) => {
  try {
    res.sendFile(
      `${path.resolve()}//public//medicalRecords//${req.query.patientId}//${req.query.recordName
      }`
    );
    var session = driver.session();
    session.run(
      `MATCH(n:Patient{value:"${
        req.query.patientId
      }"})-[r:medicalRecord{}]->(m:masterIdentifier{value:"${req.query.recordName.replace(
        /.pdf/g,
        ""
      )}"}) SET r.lastVisited = "${Date.now()}"`
    );
  } catch (err) {
    next(err);
  }
};

exports.addRecord = async (req, res, next) => {
  try {
    var patientId;
    var recordFileName;
    var recordFolderName;
    upload(req, res, function (err) {
      patientId = req.body.id;
      recordFileName = req.recordFileName;
      console.log(recordFileName);
      recordFolderName = req.recordFileName.replace(/.pdf/g, "");
      console.log(recordFolderName, "hello");
      console.log(recordFileName, patientId);
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(500).json(err);
        // A Multer error occurred when uploading.
      } else if (err) {
        console.log(err);
        return res.status(500).json(err);
        // An unknown error occurred when uploading.
      }

      return res.status(200).send({ message: "upload successfull" });
      // Everything went fine.
    });
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

    setTimeout(() => {
      fs.mkdir(
        `./public/medicalReports/${patientId}/${recordFolderName}`,
        (err) => {
          if (err) console.log(err);
        }
      );
      fs.readFile(
        `./public/medicalRecords/${patientId}/${recordFileName}`,
        (err, pdfBuffer) => {
          // pdfBuffer contains the file content
          if (!err) {
            new pdfReader.PdfReader().parseBuffer(
              pdfBuffer,
              async function (err, item) {
                if (err) console.log(err);
                else if (!item) {
                  // console.log(text);
                  reportData = reportData + text;
                  reportData.replace(/\r|\n/g, " ");
                  // console.log(reportData);
                  medicalData.custodian.display = `${reportData.split("HOSPITAL")[0]
                    }HOSPITAL`;
                  //console.log(medicalData.custodian.display);
                  medicalData.masterIdentifier.value = recordFolderName;
                  // /Date Time:\s(.*?)Name of Doctor/i
                  //   .exec(reportData)[1]
                  //   .replace(/ - /g, "-");
                  // console.log(medicalData.masterIdentifier.value);
                  medicalData.status = /Report Status:\s(.*?)Date/i.exec(
                    reportData
                  )[1];
                  //console.log(medicalData.status);
                  medicalData.subject.identifier.value = patientId;
                  // var query = `MATCH (n:Patient{value:"20000101-633940"})-[:hasName]-(m) RETURN m`;
                  // var params = {
                  //   value: medicalData.subject.identifier.value,
                  // };
                  // var session = driver.session();
                  // medicalData.subject.display = await session
                  //   .run(query, params)
                  //   .then((result) => {
                  //     var nameObj = result.records[0]._fields[0].properties;
                  //     var name = `${nameObj.prefix}.${nameObj.given[0]} ${
                  //       nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
                  //     }${nameObj.family}${
                  //       nameObj.suffix == "" ? "" : `,${nameObj.suffix}`
                  //     }`;
                  //     return name;
                  //   });
                  medicalData.subject.display = /Patient Name:\s(.*?)Age/i.exec(
                    reportData
                  )[1];
                  //console.log(medicalData.subject);
                  medicalData.context.sourcePatientInfo = medicalData.subject;
                  delete medicalData.context.sourcePatientInfo.type;
                  //console.log(medicalData.sourcePatientInfo);
                  medicalData.date = /Date Time:\s(.*?)Name of/i
                    .exec(reportData)[1]
                    .replace(/ - /g, "-");
                  //console.log(medicalData.date);
                  medicalData.author[0].identifier.value =
                    /NMC No:\s(.*?)Allergy/i.exec(reportData)[1];
                  medicalData.author[0].display =
                    /Name of Doctor:\s(.*?)MBBS/i.exec(reportData)[1];
                  //console.log(medicalData.author);
                  medicalData.authenticator = medicalData.author[0];
                  //console.log(medicalData.authenticator);
                  medicalData.description =
                    /Comments\s(.*?)Tests to be performed/i
                      .exec(reportData)[1]
                      .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
                      .split(`.`)
                      .join();
                  //console.log(medicalData.description);
                  medicalData.content[0].attachment.creation =
                    /Date Time:\s(.*?)Name of/i
                      .exec(reportData)[1]
                      .replace(/ - /g, "-");
                  medicalData.content[0].attachment.title =
                    /Record Type:\s(.*?)Category/i
                      .exec(reportData)[1]
                      .replace(/ - /g, "-")
                      .trim();
                  // console.log(medicalData.content);
                  medicalData.context.event[0].coding[0].display =
                    /Body Site:\s(.*?)Record Type/i.exec(reportData)[1];
                  // console.log(medicalData.context.event[0].coding);
                  medicalData.category[0].coding[0].code =
                    /Category:\s(.*?) Report Status/i.exec(reportData)[1];
                  medicalData.category[0].coding[0].display = mapCategoryCode(medicalData.category[0].coding[0].code)
                  console.log(medicalData.category[0].coding[0]);
                  medicalData.type.text = /Record Type:\s(.*?)Category/i
                    .exec(reportData)[1]
                    .replace(/ - /g, "-")
                    .trim();
                  medicalData.context.period.start = reportData.substring(
                    reportData.indexOf("Onset:") + 7,
                    reportData.indexOf("Onset:") + 17
                  );
                  //console.log(medicalData.context.period.start);

                  medicalData.symptoms = reportData
                    .substring(reportData.indexOf("Onset:") + 17)
                    .split(`${medicalData.custodian.display}`)[0]
                    .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
                    .split(".");
                  medicalData.symptoms = medicalData.symptoms.map((str) =>
                    str.trim()
                  );
                  medicalData.prescriptions = reportData
                    .substring(reportData.indexOf("Prescriptions") + 14)
                    .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
                    .split(".");
                  medicalData.prescriptions = medicalData.prescriptions.map(
                    (str) => str.trim()
                  );
                  //console.log(medicalData.prescriptions);
                  medicalData.toReport = {};
                  medicalData.toReport.allergy = /Allergy\s(.*?)Vital/i
                    .exec(reportData)[1]
                    .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
                    .split(".");

                  medicalData.toReport.Pulse = /Pulse:\s(.*?)per min/i.exec(
                    reportData
                  )[1];

                  medicalData.toReport.Temperature =
                    /Temperature:\s(.*?)F/i.exec(reportData)[1];

                  medicalData.toReport.Height = /Height:\s(.*?)cms/i.exec(
                    reportData
                  )[1];
                  medicalData.toReport.Weight = /Weight:\s(.*?)kgs/i.exec(
                    reportData
                  )[1];
                  medicalData.toReport.BMI = /BMI:\s(.*?)SPO2/i.exec(
                    reportData
                  )[1];
                  medicalData.toReport.SPO2 = /SPO2:\s(.*?)percentage/i.exec(
                    reportData
                  )[1];
                  medicalData.toReport.Respiration =
                    /Respiration:\s(.*?)per min/i.exec(reportData)[1];
                  medicalData.toReport.Systolic =
                    /Systolic:\s(.*?) Diastolic/i.exec(reportData)[1];
                  medicalData.toReport.Diastolic =
                    / Diastolic:\s(.*?)Symptoms/i.exec(reportData)[1];
                  //console.log(medicalData.toReport);
                  medicalData.testCommonName =
                    /Tests to be Performed\s(.*?)Prescriptions/i
                      .exec(reportData)[1]
                      .replace(/1.|2|3|4|5|6|7|8|9|0/g, "")
                      .replace(/ - /g, "-")
                      .split(".");
                  medicalData.testCommonName = medicalData.testCommonName.map(
                    (str) => str.trim()
                  );
                  var testcode = [];

                  fs.createReadStream("./data.csv")
                    .pipe(csv())
                    .on("data", (row) => {
                      if (
                        medicalData.testCommonName.includes(row.Common_Name)
                      ) {
                        testcode.push(row.Code);
                      }
                    })
                    .on("end", () => {
                      medicalData.identifier[0].value = testcode;
                      // console.log(medicalData);
                      historyTodatabase(medicalData, next);
                    });
                } else if (item.text) {
                  if (text === undefined) {
                    text = item.text;
                  } else if (y === item.y) {
                    text = text + item.text;
                  } else {
                    // console.log(text);
                    reportData = `${reportData} ${text}`;
                    text = item.text;
                  }
                  y = item.y;
                }
              }
            );
          } else {
            console.log(err);
          }
        }
      );
    }, 1000);
  } catch (err) {
    next(err);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public//medicalRecords//${req.body.id}`);
  },
  filename: function (req, file, cb) {
    req.recordFileName = `${Date.now()}.pdf`;
    console.log("hello from file Name");
    cb(null, req.recordFileName);
  },
});

const upload = multer({ storage: storage }).array("file");

async function historyTodatabase(recordObj, next) {
  var session = driver.session();
  var params = recordObj;
  var query = `MATCH(n:Patient{value:"${params.subject.identifier.value}"})
      MERGE(n)-[:medicalRecord{lastVisited:"${Date.now()}",status:"${
    params.status
  }",resourceType:"${params.resourceType}",date:"${params.date}",description:"${
    params.description
  }"}]->(m:masterIdentifier{use:"${params.masterIdentifier.use}",system:"${
    params.masterIdentifier.system
  }",value:"${params.masterIdentifier.value}"})-[:type{text:"${
    params.masterIdentifier.type.text
  }"}]->(:coding{system:"${
    params.masterIdentifier.type.coding[0].system
  }",code:"${params.masterIdentifier.type.coding[0].code}"})
      MERGE(m)-[:type{text:"${params.type.text}"}]->(:coding{system:"${
    params.type.coding[0].system
  }",code:"${params.type.coding[0].code}"})
      MERGE(m)-[:category]->(:coding{system:"${
        params.category[0].coding[0].system
      }",code:"${params.category[0].coding[0].code}",display:"${
    params.category[0].coding[0].display
  }"})
      MERGE(m)-[:subject{reference:"${params.subject.reference}",type:"${
    params.subject.type
  }",display:"${params.subject.display}"}]->(:identifier{system:"${
    params.subject.identifier.system
  }",value:"${params.subject.identifier.value}"})
      MERGE(m)-[:author{display:"${params.author[0].display}",reference:"${
    params.author[0].reference
  }",type:"${params.author[0].type}"}]->(:identifier{system:"${
    params.author[0].identifier.system
  }",value:"${params.author[0].identifier.value}"})
      MERGE(m)-[:authenticator{display:"${
        params.authenticator.display
      }",reference:"${params.authenticator.reference}",type:"${
    params.authenticator.type
  }"}]->(:identifier{system:"${
    params.authenticator.identifier.system
  }",value:"${params.authenticator.identifier.value}"})
      MERGE(m)-[:custodian{display:"${params.custodian.display}",reference:"${
    params.custodian.reference
  }",type:"${params.custodian.type}"}]->(:identifier{system:"${
    params.custodian.identifier.system
  }",value:"${params.custodian.identifier.value}"})
      MERGE(m)-[:relatesTo{code:"${
        params.relatesTo[0].code
      }"}]->(:target{reference:"${
    params.relatesTo[0].target.reference
  }"})-[:identifies]->(:identifier{system:"${
    params.relatesTo[0].target.identifier.system
  }",value:"${params.relatesTo[0].target.identifier.value}"})
      MERGE(m)-[:securityLabel{text:"${
        params.securityLabel[0].text
      }"}]->(:coding{system:"${
    params.securityLabel[0].coding[0].system
  }",code:"${params.securityLabel[0].coding[0].code}"})
      MERGE(m)-[:content{system:"${params.content[0].format.system}",code:"${
    params.content[0].format.code
  }",display:"${
    params.content[0].format.display
  }"}]->(:attachment{contentType:"${
    params.content[0].attachment.contentType
  }",language:"${params.content[0].attachment.language}",data:"${
    params.content[0].attachment.data
  }",url:"${params.content[0].attachment.url}",size:"${
    params.content[0].attachment.size
  }",hash:"${params.content[0].attachment.hash}",title:"${
    params.content[0].attachment.title
  }",creation:"${params.content[0].attachment.creation}"})
      MERGE(m)-[:context]->(a:context{start:"${
        params.context.period.start
      }",end:"${params.context.period.end}"})
      Merge(a)-[:encounter{reference:"${
        params.context.encounter[0].reference
      }",display:"${
    params.context.encounter[0].display
  }"}]->(:identifier{system:"${
    params.context.encounter[0].identifier.system
  }",value:"${params.context.encounter[0].identifier.value}"})
      Merge(a)-[:event{text:"${
        params.context.event[0].text
      }"}]->(:coding{system:"${
    params.context.event[0].coding[0].system
  }",code:"${params.context.event[0].coding[0].code}",display:"${
    params.context.event[0].coding[0].display
  }"})
      Merge(a)-[:facilityType{text:"${
        params.context.facilityType.text
      }"}]->(:coding{system:"${
    params.context.facilityType.coding[0].system
  }",value:"${params.context.facilityType.coding[0].value}"})
      Merge(a)-[:practiceSetting{text:"${
        params.context.practiceSetting.text
      }"}]->(:coding{system:"${
    params.context.practiceSetting.coding[0].system
  }",value:"${params.context.practiceSetting.coding[0].value}"})
      Merge(a)-[:sourcePatientInfo{reference:"${
        params.context.sourcePatientInfo.reference
      }",display:"${
    params.context.sourcePatientInfo.display
  }"}]->(:identifier{system:"${
    params.context.sourcePatientInfo.identifier.system
  }",value:"${params.context.sourcePatientInfo.identifier.value}"})
      Merge(a)-[:related{reference:"${
        params.context.related[0].reference
      }",display:"${
    params.context.related[0].display
  }"}]->(:identifier{system:"${
    params.context.related[0].identifier.system
  }",value:"${params.context.related[0].identifier.value}"})
      Merge(m)-[:hasSymptoms{}]->(:symptoms{symptoms:"${params.symptoms}"})
      Merge(m)-[:prescriptions{}]->(:prescriptions{prescriptions:"${
        params.prescriptions
      }"})
      Merge(m)-[:vitals{Pulse:"${params.toReport.Pulse}",Temperature:"${
    params.toReport.Temperature
  }",Height:"${params.toReport.Height}",Weight:"${
    params.toReport.Weight
  }",BMI:"${params.toReport.BMI}",SPO2:"${params.toReport.SPO2}",Respiration:"${
    params.toReport.Respiration
  }",Systolic:"${params.toReport.Systolic}",Diastolic:"${
    params.toReport.Diastolic
  }"}]->(:allergy{allergies:"${params.toReport.allergy}"})
      `;
  query = query.concat(
    params.identifier[0].value
      .map((el, i) => {
        return `MERGE (m)-[:hasReport{use:"${params.identifier[0].use}"}]->(:reportIdentifier{system:"${params.identifier[0].system}",value:"${el}"})-[:type{text:"${params.testCommonName[i]}"}]->(:coding{system:"${params.identifier[0].type.coding[0].system}",code:"${params.identifier[0].type.coding[0].code}"})
        `;
      })
      .join()
      .replace(/,MERGE/g, " MERGE")
  );
  // console.log(query);
  session
    .run(query, params)
    .then(() => {
      console.log("data uploaded");
      console.log({ message: "data upload sucessfull" });
    })
    .catch((err) => next(err));
}
