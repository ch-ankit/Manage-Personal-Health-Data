var express = require('express');
var router = express.Router();
var medicalRecordController = require("./../controller/medicalRecordController")


router
    .route('/')
    .get(medicalRecordController.getReport)
    .post(medicalRecordController.addReport)
    .patch(medicalRecordController.changeReport);


module.exports = router;