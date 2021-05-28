var driver = require("./../database");
var path = require('path');


exports.getReport = (req,res,next)=>{
    try{
      res.send({message:`${path.resolve()}\\public\\medicalReports\\${req.query.reportName}`});
    }catch(err){
      console.log(err)
    }
  }

exports.addReport = async (req,res,next)=>{
    
}