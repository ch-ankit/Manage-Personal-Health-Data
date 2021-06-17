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
