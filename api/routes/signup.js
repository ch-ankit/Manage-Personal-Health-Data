var express = require('express');
var router = express.Router();
var signupController = require("./../controller/signupController")


router
    .route('/patient')
    .post(signupController.patientSignup);
router
    .route('/doctor')
    .post(signupController.doctorSignup);


module.exports = router;