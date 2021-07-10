// // // // // const fs = require('fs');
// // // // // fs.readFile('./public/medicalReports/ac.pdf','utf-8',(err,data)=>{
// // // // //     if(err) console.log(err)
// // // // //     else {
// // // // //         console.log(data)
// // // // //         const x = data.split('\r')
// // // // //         console.log(x)
// // // // //     }
// // // // // })

// // // // var records = [{
// // // //     name:"hello",
// // // //     surname:"hi"
// // // // },
// // // // {
// // // //     name:"hello1",
// // // //     surname:"hi1"
// // // // },
// // // // {
// // // //     name:"hello2",
// // // //     surname:"hi2"
// // // // }]

// // // // var data = {}
// // // // records.forEach((el)=>{
// // // //     data += el;
// // // // })

// // // // console.log(data)

// // // MATCH(n:identifier{value:"1324"})
// // // MERGE(n)-[:identifies{}]->(m:patient{resourceType:"patient",status:"active",gender:"male",birthDate:"2001-07-21",deceasedBoolean:"false",multipleBirth:"false",multipleBirthInteger:"1"})-[a:hasName{use:"offical"}]->(o:name{given:["Pamala"],family:"Andreson"})
// // // MERGE (n)-[:isOfType{type:"coding"}]->(p:coding{system:"someurl",code:"some abbreviated value"})
// // // MERGE (n)-[:telecom{system:"email"}]->(q:email{use:"offical",value:"xxx^^@gmail.com",rank:"1"})
// // // MERGE (n)-[:address{use:"home"}]->(r:homeAddress{type:"postal",text:"Tachal Kathmandu,Nepal",line:["077123"],city:"KTM",district:"Kathmandu",country:"Nepal",state:"Bagmati",postalCode:"322343"})
// // // MERGE (n)-[:maritialStatus{text:"married"}]->(:coding{code:"abbr.",system:"url"})
// // // MERGE(n)-[:photo]->(:photo{contentType:"image/jpg",data:"",language: "Human langauge of what is in the picture",url:"imageurl", size: "size of img",hash: "hash of data",title: "what should the photo be called",creation: "date.now()"})
// // // MERGE(n)-[:communication{preferred:"true",text:"name of language"}]->(:coding{system:"url",code:"abbr."})
// // // MERGE(n)-[:generalPractitioner{reference:"literal reference",type:"url as above"}]->(z:practitioner{name:"i am doctor"})
// // // MERGE(n)-[:link{type:"see-also/replacedby"}]->(:other{reference:"patientid"})

// // // {
// // //     "resourceType":"Patient",
// // //     "identifier": [
// // //         {
// // //             "use": "official",
// // //             "type": {
// // //                 "coding": [
// // //                     {
// // //                         "system": "uri of the system that defines what code is uesd and what it represents Eg. https://terminology.hl7.org/2.1.0/CodeSystem-v2-0203.html",
// // //                         "code": "What us used in code to generate unique id? DR=Drivers Licence etc"
// // //                     }
// // //                 ]
// // //             },
// // //             "system": "Our system url which generates the unique identifier",
// // //             "value": "Value of our unique identifier"
// // //         }
// // //     ],
// // //     "active": true,
// // //     "name":[
// // //         {
// // //             "use": "official",
// // //             "family": "//Bhandari",
// // //             "given": [
// // //               "//Nixchal"
// // //           ]
// // //         }
// // //     ],
// // //     "telecom": [
// // //         {
// // //             "system": "phone",
// // //             "value": "//9874561230",
// // //             "use": "mobile",
// // //             "rank": 1
// // //         },
// // //         {
// // //             "system": "email",
// // //             "value":"//nbhn333@gmail.com",
// // //             "use": "work",
// // //             "rank": 2
// // //         }
// // //     ],
// // //     "gender": "male",
// // //     "birthDate": "The format is YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+zz:zz,",
// // //     "deceasedBoolean": false,
// // //     "address": [
// // //         {
// // //             "use": "home",
// // //             "type":"postal/physical/both",
// // //             "text": "Text representation of address",
// // //             "line": [
// // //                 "Can contain following: HouseNumber,appartment number, street name, street direction, P.O. Box number, delivery hints, and similar address information"
// // //             ],
// // //             "city": "Name of city",
// // //             "district": "district",
// // //             "country": "Name of country",
// // //             "state": "sateno",
// // //             "postalCode": "postalCode"
// // //         }
// // //     ],
// // //     "maritalStatus": {
// // //         "coding": [
// // //             {
// // //                 "system": "which system describes our code",
// // //                 "code": "Marital status code from: https://www.hl7.org/fhir/valueset-marital-status.html"
// // //             }
// // //         ],
// // //         "text": "defination of the marital status code: Married/Annuled/widowed/not married etc."
// // //     },
// // //     "multipleBirthBoolean": "twin/triplets? true/false",
// // //     "multipleBirthInteger": "Integer value indicating birth order. In triplets firstborn=1,secondborn=2 and so on",
// // //     "photo": [
// // //         {
// // //             "contentType": "image/jpg",
// // //             "data":"",
// // //             "language": "Human langauge of what is in the picture",
// // //             "url":"imageurl",
// // //             "size": "size of img",
// // //             "hash": "hash of data",
// // //             "title": "what should the photo be called",
// // //             "creation": "created datetime"
// // //         }
// // //     ],
// // //     "contact": [
// // //         {
// // //             "relationship": [
// // //                 {
// // //                     "coding": [
// // //                         {
// // //                           "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
// // //                           "code": "E"
// // //                         }
// // //                     ],
// // //                     "text": "What is the relationship"
// // //                 }
// // //             ],
// // //             "name": {
// // //                     "use": "official",
// // //                     "family": "//Bhandari",
// // //                     "given": [
// // //                       "//Nixchal"
// // //                   ]
// // //             },
// // //             "telecom": [
// // //                 {
// // //                     "system": "phone",
// // //                     "value": "//9874561230",
// // //                     "use": "mobile",
// // //                     "rank": 1
// // //                 }
// // //             ],
// // //             "address": {
// // //                 "use": "home",
// // //             "type":"postal/physical/both",
// // //             "text": "Text representation of address",
// // //             "line": [
// // //                 "Can contain following: HouseNumber,appartment number, street name, street direction, P.O. Box number, delivery hints, and similar address information"
// // //             ],
// // //             "city": "Name of city",
// // //             "district": "district",
// // //             "country": "Name of country",
// // //             "state": "sateno",
// // //             "postalCode": "postalCode"
// // //             },
// // //             "gender": "male",
// // //             "organization": {
// // //                 "reference": "Organization/1",
// // //                 "display": "Walt Disney Corporation//Organization associated with the contact"
// // //               }
// // //         }
// // //     ],
// // //     "communication": [
// // //         {
// // //             "language": {
// // //                 "coding": [
// // //                     {
// // //                         "system": "url of system which describes our code",
// // //                         "code": "code for language: ar for Arabic"
// // //                     }
// // //                 ],
// // //                 "text": "Name of language"
// // //             },
// // //             "preferred": "true/false"
// // //         }
// // //     ],
// // //     "generalPractitioner": [
// // //         {
// // //             "reference": "Literal reference, Relative, internal or absolute URL of the practitioner",
// // //             "type": "what does the reference refer to?, here practitioner so use the same url as above",
// // //             "identifier": {
// // //                 "use": "official",
// // //                 "type": {
// // //                     "coding": [
// // //                         {
// // //                             "system": "uri of the system that defines what code is uesd and what it represents Eg. https://terminology.hl7.org/2.1.0/CodeSystem-v2-0203.html",
// // //                             "code": "What us used in code to generate unique id? DR=Drivers Licence etc"
// // //                         }
// // //                     ]
// // //                 },
// // //                 "system": "Our system url which generates the unique identifier",
// // //                 "value": "Value of our unique identifier"
// // //             }
// // //         }
// // //     ],
// // //     "link": [
// // //         {
// // //             "type": "see-also/replaced-by",
// // //             "other": {
// // //                 "reference": "Patient/patientid"
// // //             }
// // //         }
// // //     ]
// // // }

// // // {
// // //     "resourceType":"Practitioner",
// // //     "identifier": [
// // //         {
// // //             "use": "official",
// // //             "type": {
// // //                 "coding": [
// // //                     {
// // //                         "system": "uri of the system that defines what code is uesd and what it represents Eg. https://terminology.hl7.org/2.1.0/CodeSystem-v2-0203.html",
// // //                         "code": "What us used in code to generate unique id? DR=Drivers Licence etc"
// // //                     }
// // //                 ]
// // //             },
// // //             "system": "Our system url which generates the unique identifier",
// // //             "value": "Value of our unique identifier"
// // //         }
// // //     ],
// // //     "active": true,
// // //     "name": [
// // //         {
// // //             "use": "official",
// // //             "family": "//Bhandari",
// // //             "given": [
// // //               "//Nixchal"
// // //           ]
// // //         }
// // //     ],
// // //     "telecom": [
// // //         {
// // //             "system": "phone",
// // //             "value": "//9874561230",
// // //             "use": "mobile",
// // //             "rank": 1
// // //         },
// // //         {
// // //             "system": "email",
// // //             "value":"//nbhn333@gmail.com",
// // //             "use": "work",
// // //             "rank": 2
// // //         }
// // //     ],
// // //     "address": [
// // //         {
// // //             "use": "home",
// // //             "type":"postal/physical/both",
// // //             "text": "Text representation of address",
// // //             "line": [
// // //                 "Can contain following: HouseNumber,appartment number, street name, street direction, P.O. Box number, delivery hints, and similar address information"
// // //             ],
// // //             "city": "Name of city",
// // //             "district": "district",
// // //             "country": "Name of country",
// // //             "state": "sateno",
// // //             "postalCode": "postalCode"
// // //         }
// // //     ],
// // //     "gender": "male",
// // //     "birthDate": "The format is YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+zz:zz,",
// // //     "photo": [
// // //         {
// // //             "contentType": "image/jpg",
// // //             "data":"",
// // //             "language": "Human langauge of what is in the picture",
// // //             "url":"imageurl",
// // //             "size": "size of img",
// // //             "hash": "hash of data",
// // //             "title": "what should the photo be called",
// // //             "creation": "created datetime"
// // //         }
// // //     ],
// // // "qualification": [
// // //     {
// // //         "identifier": [
// // //             {
// // //                 "system": "University url which can identify the doctor",
// // //                 "value": "Value of our unique identifier"
// // //             }
// // //         ],
// // //         "code": {
// // //             "coding": [
// // //               {
// // //                 "system": "http://terminology.hl7.org/CodeSystem/v2-0360/2.7",
// // //                 "code": "BS",
// // //                 "display": "Bachelor of Science"
// // //               }
// // //             ],
// // //             "text": "Bachelor of Science"
// // //         },
// // //         "period": {
// // //             "start": "When the degree started"
// // //         },
// // //         "issuer": {
// // //             "display": "Name of university or organization who issued qualification"
// // //         }
// // //     }
// // // ],
// // //     "communication": [
// // //         {
// // //             "language": {
// // //                 "coding": [
// // //                     {
// // //                         "system": "url of system which describes our code",
// // //                         "code": "code for language: ar for Arabic"
// // //                     }
// // //                 ],
// // //                 "text": "Name of language"
// // //             },
// // //             "preferred": "true/false"
// // //         }
// // //     ]
// // // }

// // // exports.patientLogin = async (req, res, next) => {
// // //   console.log(req.body);
// // //   var session = driver.session();
// // //   console.log(req.body.id);
// // //   var query = `MATCH (n:Patient{value:"${req.body.id}"}) -[:identifies{}]->(m:patient) MATCH (n)-[r:hasName{}]->(m1:name) MATCH(n)-[r1:telecom]->(m2) return n,m,r,m1,r1,m2`;
// // //   session
// // //     .run(query)
// // //     .then(async (result) => {
// // //       if (result.records[0] !== undefined) {
// // //         let passwordMatched = await bcrypt.compare(
// // //           req.body.password,
// // //           result.records[0]._fields[0].properties.password
// // //         );
// // //         if (!passwordMatched) {
// // //           res.send("USERNAME OR PASSWORD NOT CORRECT");
// // //         } else {
// // //           let token = jwt.sign(
// // //             { email: req.body.email },
// // //             process.env.TOKEN_SECRET,
// // //             { expiresIn: 86400 }
// // //           );

// // //           var data = Object.keys(result.records).map(
// // //             (el) => result.records[el]._fields[0].properties
// // //           );
// // //           // var data1 = result.records[0]._fields[1].properties;

// // //           // var data2 = Object.keys(result.records).map(
// // //           //   (el) => result.records[el]._fields[2].properties
// // //           // );
// // //           // var data3 = Object.keys(result.records).map(
// // //           //   (el) => result.records[el]._fields[3].properties
// // //           // );
// // //           // var data4 = Object.keys(result.records).map(
// // //           //   (el) => result.records[el]._fields[4].properties
// // //           // );
// // //           // var data5 = Object.keys(result.records).map(
// // //           //   (el) => result.records[el]._fields[5].properties
// // //           // );

// // //           var data = await comparer(data);
// // //           // data2 = await comparer(data2);
// // //           // data3 = await comparer(data3);
// // //           // data4 = await comparer(data4);
// // //           // data5 = await comparer(data5);
// // //           function comparer(x) {
// // //             console.log(x.length);
// // //             // var obj1key = Object.keys(x[x.length - 1])[0];
// // //             // var obj2key = Object.keys(x[x.length - 2])[0];
// // //             if (
// // //               JSON.stringify(x[x.length - 1]) ===
// // //               JSON.stringify(x[x.length - 2])
// // //             ) {
// // //               x.pop();
// // //               console.log("hi from if");
// // //               comparer(x);
// // //             } else {
// // //               console.log(x);
// // //               return x;
// // //             }
// // //           }
// // //           console.log(data);
// // //           // console.log(data5);
// // //           // for (var i = 0; i < data4.length; i++) {
// // //           //   data5[i].system = data4[i].system;
// // //           // }

// // //           var patient = {};
// // //           patient.identifier = [
// // //             {
// // //               use: data[0].use,
// // //               type: {
// // //                 coding: [
// // //                   {
// // //                     system: data[0].identifierCodingSystem,
// // //                     code: data[0].identifierCodingCode,
// // //                   },
// // //                 ],
// // //               },
// // //               system: data[0].System,
// // //               value: data[0].value,
// // //             },
// // //           ];
// // //           // patient = { ...patient, ...data1 };
// // //           // patient.name = [data3];
// // //           // patient.name[0] = { ...patient.name[0], ...data2 };
// // //           // patient.telecom = data5;

// // //           patient.token = token;
// // //           res.send({ patient });
// // //         }
// // //       } else {
// // //         res.send({ message: "Unregistered Username" });
// // //       }
// // //     })
// // //     .catch((err) => next(err));
// // // };

// {
//     "resourceType":"Observation",
//     "identifier": [
//         {
//             "use": "official",
//             "type": {
//                 "coding": [
//                     {
//                         "system": "Take user id and take datetime",
//                         "code": "UID-DateTime"
//                     }
//                 ]
//             },
//             "text":"name of test"
//             "system": "Our system url which generates the uniqe id http://localhost:3000/uniqueObservation",
//             "value": "Value of our unique identifier for an observation"
//         }
//     ],
//     "basedOn": [
//         {
//             "reference": "url of our service request",
//             "type": "Service Request",
//             "identifier": {
//                 "use": "official",
//                 "type": {
//                     "coding": [
//                         {
//                             "system": "What is used to make the code for service request",
//                             "code": "Code for the  request"
//                         }
//                     ]
//                 },
//                 "system": "our system url for generating service request",
//                 "value": "value of identifier of service req"
//             },
//             "display": "Text description of what is referenced"
//         }
//     ],
//     "partOf": [{
//         "reference": ""
//     }],
//     "status": " registered | preliminary | final | amended ",
//     "category": [{
//         "coding": [

//         ],
//         "text": "Classification of type of observation"
//     }],
//     "code": {
//         "coding": [
//             {
//                 "system": "http://loinc.org",
//                 "code": "codes in above url",
//                 "display": "Text to describe what the code means"
//             }
//         ],
//         "text": "plain text to describe the coding system"
//     },
//     "subject": {
//         "reference": "url of patient",
//         "type": "Patient",
//         "identifier": {
//             "value": "patient id"
//         },
//         "display": "Text for description"
//     },
//     "focus": [{
//         "reference": "What the observation is about  if it is not about Service Request"
//     }],
//     "encounter": {
//         "reference": "url of encounter",
//         "type": "Encounter",
//         "identifier": {
//             "value": "Value of encounter"
//         },
//         "display": "Text description"
//     },
//     "effectiveDateTime": " Clinically relevant time/time-period for observation.A date, date-time or partial date (e.g. just year or year + month) as used in human communication. The format is YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+zz:zz, e.g. 2018, 1973-06, 1905-08-23, 2015-02-07T13:28:17-05:00 or 2017-01-01T00:00:00.000Z. If hours and minutes are specified, a time zone SHALL be populated. Seconds must be provided due to schema type constraints but may be zero-filled and may be ignored at receiver discretion. Dates SHALL be valid dates. The time "24:00" is not allowed",
//     "issued": "When was this obs. issued. An instant in time in the format YYYY-MM-DDThh:mm:ss.sss+zz:zz (e.g. 2015-02-07T13:28:17.239+02:00 or 2017-01-01T00:00:00Z). The time SHALL specified at least to the second and SHALL include a time zone. Note: This is intended for when precisely observed times are required (typically system logs etc.), and not human-reported times - for those, use date or dateTime (which can be as precise as instant, but is not required to be). instant is a more constrained dateTime",
//     "performer": [
//         {
//             "reference": "url of practitioner",
//             "type": "Practitioner",
//             "identifier": {
//                 "value": "id of the practitioner"
//             },
//             "display": "Text description."
//         }
//     ],
//     // value[x]: Actual result. One of these 11:
//   "valueQuantity" : {
//       "value": 0,
//       "comparator": "comarision operators <,>,=<",
//        "unit": "unit of representation cc/m3, mol/l",
//        "code": "code of unit"
//    },
//   "valueCodeableConcept" : {
//       "coding": [
//           {
//             "system": "url of system",
//             "code": "code of the concept"
//           }
//       ],
//       "text": "Plain text of concept"
//    },
//   "valueString" : "<string>",
//   "valueBoolean" : "true/false boolean",
//   "valueInteger" : "integer value",
//   "valueRange" : {
//       "low": {
//           "value": 30,
//           "comparator": "<"
//       },
//       "high": {
//         "value": 30,
//         "comparator": ">"
//       }
//    },
//   "valueRatio" : {
//       "numerator": {
//           "value": 10
//       },
//       "denominator": {
//           "value": 5
//       }
//    },
//   "valueSampledData" : {
//       "origin": {
//           "value": "Base value of measurement"
//       },
//       "period": "Number of milliseconds between samples",
//       "factor": "Multiply data by this before adding to origin",
//       "lowerLimit": 4,
//       "upperLimit": 5,
//       "dimensions": "number of sample points",
//       "data":"Decimal values with spaces, or E=error | U=above detection limit | L= below detection limit"
//    },
//   "valueTime" : "<time>",
//   "valueDateTime" : "<dateTime>",
//   "valuePeriod" : {
//       "start": "<dateTime",
//       "end": "<datetime>"
//    },
//    "dataAbsentReason": {
//        "coding": [
//            {
//                "system": "url of system",
//                "code": "U for unavailable, N for not permitted"
//            }
//        ],
//        "text": "Text description why data is absent"
//    },
//    "interpretation": [
//        {
//            "coding": [
//                 {
//                     "system": "url",
//                     "code": "H for high, L for Low etc"
//                 }
//            ],
//            "text": "high/low/normal"
//        }
//    ],
//    "note": [
//        {
//            "authorReference": {
//                "reference": "url of author",
//                "identifier": {
//                    "system": "url",
//                    "value": "id of author"
//                },
//                "type": "Practitioner"
//            },
//            "authorString": "Some string with author name",
//            "time": "<datetime>",
//            "text": "Text content"
//        }
//    ],
//    "bodySite": {
//        "coding": [
//            {
//                "system": "url of system",
//                "code": ""
//            }
//        ],
//        "text": "text representation of what body part is under study"
//    },
//    "method": {
//        "coding": [
//            {
//                "system": "url",
//                "code": "I for imaging, similar"
//            }
//        ],
//        "text": "text representation of what method was used to study body part"
//    },
//    "specimen": {
//        "reference": "what reference specimen was taken for study? blood? urine etc.",
//        "identifier": {
//            "system": "url of system where speciment data is present",
//            "value": "what value was given to specimen"
//        },
//        "type": "Specimen"
//    },
//    "device": {
//         "reference": "what device was used for measuremnt",
//         "identifier": {
//             "system": "url of system where device data is present",
//             "value": "what value was given to device"
//         },
//         "type": "Device"
//    },
//    "referenceRange": [
//        {
//         "low" : {
//             "value": 30,
//             "comparator": "<"
//          },
//         "high" : {
//             "value": 30,
//             "comparator": "<"
//         },
//         "age" : {
//             "low": {
//                 "value": 30,
//                 "comparator": "<"
//             },
//             "high": {
//                 "value": 30,
//                 "comparator": "<"
//             }
//          },
//         "text" : "<string>"
//        }
//    ],
//    "hasMember": [
//        {
//            "reference": "Related observation to this one",
//            "type": "Observation",
//            "identifier": {
//                "system": "system url which contains another observation",
//                "value": "id for another observation"
//            }
//        }
//    ],
//    "derivedFrom": [
//         {
//             "reference": "Related documents this observation is made from",
//             "type": "Observation",
//             "identifier": {
//                 "system": "system url which contains other documents",
//                 "value": "id for another document"
//             }
//         }
//    ],
//    "component": [
//        {
//         "code": {
//             "coding": [
//                 {
//                     "system": "",
//                     "code": ""
//                 }
//             ],
//             "text": ""
//         },
//         "valueQuantity" : {
//              "value": 0,
//              "comparator": "comarision operators <,>,=<",
//               "unit": "unit of representation cc/m3, mol/l",
//               "code": "code of unit"
//          },
//         "valueCodeableConcept" : {
//             "coding": [
//                 {
//                   "system": "url of system",
//                   "code": "code of the concept"
//                 }
//             ],
//             "text": "Plain text of concept"
//          },
//         "valueString" : "<string>",
//         "valueBoolean" : "true/false boolean",
//         "valueInteger" : "integer value",
//         "valueRange" : {
//             "low": {
//                 "value": 30,
//                 "comparator": "<"
//             },
//             "high": {
//               "value": 30,
//               "comparator": ">"
//             }
//          },
//         "valueRatio" : {
//             "numerator": {
//                 "value": 10
//             },
//             "denominator": {
//                 "value": 5
//             }
//          },
//         "valueSampledData" : {
//             "origin": {
//                 "value": "Base value of measurement"
//             },
//             "period": "Number of milliseconds between samples",
//             "factor": "Multiply data by this before adding to origin",
//             "lowerLimit": 4,
//             "upperLimit": 5,
//             "dimensions": "number of sample points",
//             "data":"Decimal values with spaces, or E=error | U=above detection limit | L= below detection limit"
//          },
//         "valueTime" : "<time>",
//         "valueDateTime" : "<dateTime>",
//         "valuePeriod" : {
//             "start": "<dateTime",
//             "end": "<datetime>"
//          },
//          "dataAbsentReason": {
//             "coding": [
//                 {
//                     "system": "url of system",
//                     "code": "U for unavailable, N for not permitted"
//                 }
//             ],
//             "text": "Text description why data is absent"
//         },
//         "interpretation": [
//             {
//                 "coding": [
//                      {
//                          "system": "url",
//                          "code": "H for high, L for Low etc"
//                      }
//                 ],
//                 "text": "high/low/normal"
//             }
//         ]
//        }
//    ]
// }
// {
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
//     "description": "<string description  of the report>",
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
// var x = [1, 2, 3];
// var s = "an ";
// s = s.concat(
//   x
//     .map((el) => {
//       return `Merge (m)-[:isRecordOf{use:"${x[0]}"}}]->(:labReport{use:$i})`;
//     })
//     .join()
//     .replace(/,/g, " ")
// );

// console.log(s);
