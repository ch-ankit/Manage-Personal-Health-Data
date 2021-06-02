var driver = require("./../database");
var path = require('path');
var multer = require('multer')

exports.getReport = async (req, res, next) => {
  try {
    res.sendFile(`${path.resolve()}\\public\\medicalReports\\${req.query.id}\\${req.query.reportName}`);
  } catch (err) {
    next(err)
  }
}

exports.addReport = async (req, res, next) => {
  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
        // A Multer error occurred when uploading.
      } else if (err) {
        return res.status(500).json(err)
        // An unknown error occurred when uploading.
      }
      return res.status(200).send(req.files)
      // Everything went fine.
    })
  } catch (err) {
    next(err)
  }

}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body.id)
    cb(null, `public\\medicalReports\\${req.body.id}`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage }).array('file')

exports.changeReport = (req, res, next) => {
  res.send(req.body);
}