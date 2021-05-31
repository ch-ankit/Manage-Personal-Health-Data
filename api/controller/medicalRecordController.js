var driver = require("./../database");
var path = require('path');
const fs = require('fs')
var multer = require('multer')

exports.getReport = async (req,res,next)=>{
    try{
      console.log(req.body)
      res.sendFile(`${path.resolve()}\\public\\medicalReports\\${req.query.reportName}`);
    }catch(err){
      next(err)
    }
  }

exports.addReport = async (req,res,next)=>{
  console.log(req.body.id)
  // fs.mkdir(`${path.resolve()}\\public\\medicalReports\\${req.body.id}`,(err)=>{
  //   if(err) console.log(err);
  // })
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
      // A Multer error occurred when uploading.
    } else if (err) {
        return res.status(500).json(err)
      // An unknown error occurred when uploading.
    } 
    return res.status(200).send(req.file)
    // Everything went fine.
  })

}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).array('file')

exports.changeReport = (req,res,next)=>{
  res.send(req.body);
}