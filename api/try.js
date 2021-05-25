const fs = require('fs');
fs.readFile('./public/medicalReports/ac.pdf','utf-8',(err,data)=>{
    if(err) console.log(err)
    else {
        console.log(data)
        const x = data.split('\r')
        console.log(x)
    }
})
