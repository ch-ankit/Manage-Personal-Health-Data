// const fs = require('fs');
// fs.readFile('./public/medicalReports/ac.pdf','utf-8',(err,data)=>{
//     if(err) console.log(err)
//     else {
//         console.log(data)
//         const x = data.split('\r')
//         console.log(x)
//     }
// })

var records = [{
    name:"hello",
    surname:"hi"
},
{
    name:"hello1",
    surname:"hi1"
},
{
    name:"hello2",
    surname:"hi2"
}]

var data = {}
records.forEach((el)=>{
    data += el;
})

console.log(data)