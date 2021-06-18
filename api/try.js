// // // const fs = require('fs');
// // // fs.readFile('./public/medicalReports/ac.pdf','utf-8',(err,data)=>{
// // //     if(err) console.log(err)
// // //     else {
// // //         console.log(data)
// // //         const x = data.split('\r')
// // //         console.log(x)
// // //     }
// // // })

// // var records = [{
// //     name:"hello",
// //     surname:"hi"
// // },
// // {
// //     name:"hello1",
// //     surname:"hi1"
// // },
// // {
// //     name:"hello2",
// //     surname:"hi2"
// // }]

// // var data = {}
// // records.forEach((el)=>{
// //     data += el;
// // })

// // console.log(data)

// MATCH(n:identifier{value:"1324"})
// MERGE(n)-[:identifies{}]->(m:patient{resourceType:"patient",status:"active",gender:"male",birthDate:"2001-07-21",deceasedBoolean:"false",multipleBirth:"false",multipleBirthInteger:"1"})-[a:hasName{use:"offical"}]->(o:name{given:["Pamala"],family:"Andreson"})
// MERGE (n)-[:isOfType{type:"coding"}]->(p:coding{system:"someurl",code:"some abbreviated value"})
// MERGE (n)-[:telecom{system:"email"}]->(q:email{use:"offical",value:"xxx^^@gmail.com",rank:"1"})
// MERGE (n)-[:address{use:"home"}]->(r:homeAddress{type:"postal",text:"Tachal Kathmandu,Nepal",line:["077123"],city:"KTM",district:"Kathmandu",country:"Nepal",state:"Bagmati",postalCode:"322343"})
// MERGE (n)-[:maritialStatus{text:"married"}]->(:coding{code:"abbr.",system:"url"})
// MERGE(n)-[:photo]->(:photo{contentType:"image/jpg",data:"",language: "Human langauge of what is in the picture",url:"imageurl", size: "size of img",hash: "hash of data",title: "what should the photo be called",creation: "date.now()"})
// MERGE(n)-[:communication{preferred:"true",text:"name of language"}]->(:coding{system:"url",code:"abbr."})
// MERGE(n)-[:generalPractitioner{reference:"literal reference",type:"url as above"}]->(z:practitioner{name:"i am doctor"})
// MERGE(n)-[:link{type:"see-also/replacedby"}]->(:other{reference:"patientid"})

// {
//     "resourceType":"Patient",
//     "identifier": [
//         {
//             "use": "official",
//             "type": {
//                 "coding": [
//                     {
//                         "system": "uri of the system that defines what code is uesd and what it represents Eg. https://terminology.hl7.org/2.1.0/CodeSystem-v2-0203.html",
//                         "code": "What us used in code to generate unique id? DR=Drivers Licence etc"
//                     }
//                 ]
//             },
//             "system": "Our system url which generates the unique identifier",
//             "value": "Value of our unique identifier"
//         }
//     ],
//     "active": true,
//     "name":[
//         {
//             "use": "official",
//             "family": "//Bhandari",
//             "given": [
//               "//Nixchal"
//           ]
//         }
//     ],
//     "telecom": [
//         {
//             "system": "phone",
//             "value": "//9874561230",
//             "use": "mobile",
//             "rank": 1
//         },
//         {
//             "system": "email",
//             "value":"//nbhn333@gmail.com",
//             "use": "work",
//             "rank": 2
//         }
//     ],
//     "gender": "male",
//     "birthDate": "The format is YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+zz:zz,",
//     "deceasedBoolean": false,
//     "address": [
//         {
//             "use": "home",
//             "type":"postal/physical/both",
//             "text": "Text representation of address",
//             "line": [
//                 "Can contain following: HouseNumber,appartment number, street name, street direction, P.O. Box number, delivery hints, and similar address information"
//             ],
//             "city": "Name of city",
//             "district": "district",
//             "country": "Name of country",
//             "state": "sateno",
//             "postalCode": "postalCode"
//         }
//     ],
//     "maritalStatus": {
//         "coding": [
//             {
//                 "system": "which system describes our code",
//                 "code": "Marital status code from: https://www.hl7.org/fhir/valueset-marital-status.html"
//             }
//         ],
//         "text": "defination of the marital status code: Married/Annuled/widowed/not married etc."
//     },
//     "multipleBirthBoolean": "twin/triplets? true/false",
//     "multipleBirthInteger": "Integer value indicating birth order. In triplets firstborn=1,secondborn=2 and so on",
//     "photo": [
//         {
//             "contentType": "image/jpg",
//             "data":"",
//             "language": "Human langauge of what is in the picture",
//             "url":"imageurl",
//             "size": "size of img",
//             "hash": "hash of data",
//             "title": "what should the photo be called",
//             "creation": "created datetime"
//         }
//     ],
//     "contact": [
//         {
//             "relationship": [
//                 {
//                     "coding": [
//                         {
//                           "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
//                           "code": "E"
//                         }
//                     ],
//                     "text": "What is the relationship"
//                 }
//             ],
//             "name": {
//                     "use": "official",
//                     "family": "//Bhandari",
//                     "given": [
//                       "//Nixchal"
//                   ]
//             },
//             "telecom": [
//                 {
//                     "system": "phone",
//                     "value": "//9874561230",
//                     "use": "mobile",
//                     "rank": 1
//                 }
//             ],
//             "address": {
//                 "use": "home",
//             "type":"postal/physical/both",
//             "text": "Text representation of address",
//             "line": [
//                 "Can contain following: HouseNumber,appartment number, street name, street direction, P.O. Box number, delivery hints, and similar address information"
//             ],
//             "city": "Name of city",
//             "district": "district",
//             "country": "Name of country",
//             "state": "sateno",
//             "postalCode": "postalCode"
//             },
//             "gender": "male",
//             "organization": {
//                 "reference": "Organization/1",
//                 "display": "Walt Disney Corporation//Organization associated with the contact"
//               }
//         }
//     ],
//     "communication": [
//         {
//             "language": {
//                 "coding": [
//                     {
//                         "system": "url of system which describes our code",
//                         "code": "code for language: ar for Arabic"
//                     }
//                 ],
//                 "text": "Name of language"
//             },
//             "preferred": "true/false"
//         }
//     ],
//     "generalPractitioner": [
//         {
//             "reference": "Literal reference, Relative, internal or absolute URL of the practitioner",
//             "type": "what does the reference refer to?, here practitioner so use the same url as above",
//             "identifier": {
//                 "use": "official",
//                 "type": {
//                     "coding": [
//                         {
//                             "system": "uri of the system that defines what code is uesd and what it represents Eg. https://terminology.hl7.org/2.1.0/CodeSystem-v2-0203.html",
//                             "code": "What us used in code to generate unique id? DR=Drivers Licence etc"
//                         }
//                     ]
//                 },
//                 "system": "Our system url which generates the unique identifier",
//                 "value": "Value of our unique identifier"
//             }
//         }
//     ],
//     "link": [
//         {
//             "type": "see-also/replaced-by",
//             "other": {
//                 "reference": "Patient/patientid"
//             }
//         }
//     ]
// }

// {
//     "resourceType":"Practitioner",
//     "identifier": [
//         {
//             "use": "official",
//             "type": {
//                 "coding": [
//                     {
//                         "system": "uri of the system that defines what code is uesd and what it represents Eg. https://terminology.hl7.org/2.1.0/CodeSystem-v2-0203.html",
//                         "code": "What us used in code to generate unique id? DR=Drivers Licence etc"
//                     }
//                 ]
//             },
//             "system": "Our system url which generates the unique identifier",
//             "value": "Value of our unique identifier"
//         }
//     ],
//     "active": true,
//     "name": [
//         {
//             "use": "official",
//             "family": "//Bhandari",
//             "given": [
//               "//Nixchal"
//           ]
//         }
//     ],
//     "telecom": [
//         {
//             "system": "phone",
//             "value": "//9874561230",
//             "use": "mobile",
//             "rank": 1
//         },
//         {
//             "system": "email",
//             "value":"//nbhn333@gmail.com",
//             "use": "work",
//             "rank": 2
//         }
//     ],
//     "address": [
//         {
//             "use": "home",
//             "type":"postal/physical/both",
//             "text": "Text representation of address",
//             "line": [
//                 "Can contain following: HouseNumber,appartment number, street name, street direction, P.O. Box number, delivery hints, and similar address information"
//             ],
//             "city": "Name of city",
//             "district": "district",
//             "country": "Name of country",
//             "state": "sateno",
//             "postalCode": "postalCode"
//         }
//     ],
//     "gender": "male",
//     "birthDate": "The format is YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+zz:zz,",
//     "photo": [
//         {
//             "contentType": "image/jpg",
//             "data":"",
//             "language": "Human langauge of what is in the picture",
//             "url":"imageurl",
//             "size": "size of img",
//             "hash": "hash of data",
//             "title": "what should the photo be called",
//             "creation": "created datetime"
//         }
//     ],
// "qualification": [
//     {
//         "identifier": [
//             {
//                 "system": "University url which can identify the doctor",
//                 "value": "Value of our unique identifier"
//             }
//         ],
//         "code": {
//             "coding": [
//               {
//                 "system": "http://terminology.hl7.org/CodeSystem/v2-0360/2.7",
//                 "code": "BS",
//                 "display": "Bachelor of Science"
//               }
//             ],
//             "text": "Bachelor of Science"
//         },
//         "period": {
//             "start": "When the degree started"
//         },
//         "issuer": {
//             "display": "Name of university or organization who issued qualification"
//         }
//     }
// ],
//     "communication": [
//         {
//             "language": {
//                 "coding": [
//                     {
//                         "system": "url of system which describes our code",
//                         "code": "code for language: ar for Arabic"
//                     }
//                 ],
//                 "text": "Name of language"
//             },
//             "preferred": "true/false"
//         }
//     ]
// }

// exports.patientLogin = async (req, res, next) => {
//   console.log(req.body);
//   var session = driver.session();
//   console.log(req.body.id);
//   var query = `MATCH (n:Patient{value:"${req.body.id}"}) -[:identifies{}]->(m:patient) MATCH (n)-[r:hasName{}]->(m1:name) MATCH(n)-[r1:telecom]->(m2) return n,m,r,m1,r1,m2`;
//   session
//     .run(query)
//     .then(async (result) => {
//       if (result.records[0] !== undefined) {
//         let passwordMatched = await bcrypt.compare(
//           req.body.password,
//           result.records[0]._fields[0].properties.password
//         );
//         if (!passwordMatched) {
//           res.send("USERNAME OR PASSWORD NOT CORRECT");
//         } else {
//           let token = jwt.sign(
//             { email: req.body.email },
//             process.env.TOKEN_SECRET,
//             { expiresIn: 86400 }
//           );

//           var data = Object.keys(result.records).map(
//             (el) => result.records[el]._fields[0].properties
//           );
//           // var data1 = result.records[0]._fields[1].properties;

//           // var data2 = Object.keys(result.records).map(
//           //   (el) => result.records[el]._fields[2].properties
//           // );
//           // var data3 = Object.keys(result.records).map(
//           //   (el) => result.records[el]._fields[3].properties
//           // );
//           // var data4 = Object.keys(result.records).map(
//           //   (el) => result.records[el]._fields[4].properties
//           // );
//           // var data5 = Object.keys(result.records).map(
//           //   (el) => result.records[el]._fields[5].properties
//           // );

//           var data = await comparer(data);
//           // data2 = await comparer(data2);
//           // data3 = await comparer(data3);
//           // data4 = await comparer(data4);
//           // data5 = await comparer(data5);
//           function comparer(x) {
//             console.log(x.length);
//             // var obj1key = Object.keys(x[x.length - 1])[0];
//             // var obj2key = Object.keys(x[x.length - 2])[0];
//             if (
//               JSON.stringify(x[x.length - 1]) ===
//               JSON.stringify(x[x.length - 2])
//             ) {
//               x.pop();
//               console.log("hi from if");
//               comparer(x);
//             } else {
//               console.log(x);
//               return x;
//             }
//           }
//           console.log(data);
//           // console.log(data5);
//           // for (var i = 0; i < data4.length; i++) {
//           //   data5[i].system = data4[i].system;
//           // }

//           var patient = {};
//           patient.identifier = [
//             {
//               use: data[0].use,
//               type: {
//                 coding: [
//                   {
//                     system: data[0].identifierCodingSystem,
//                     code: data[0].identifierCodingCode,
//                   },
//                 ],
//               },
//               system: data[0].System,
//               value: data[0].value,
//             },
//           ];
//           // patient = { ...patient, ...data1 };
//           // patient.name = [data3];
//           // patient.name[0] = { ...patient.name[0], ...data2 };
//           // patient.telecom = data5;

//           patient.token = token;
//           res.send({ patient });
//         }
//       } else {
//         res.send({ message: "Unregistered Username" });
//       }
//     })
//     .catch((err) => next(err));
// };
