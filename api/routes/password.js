var express = require('express');
var router = express.Router();
var signupController = require("./../controller/signupController")

router
    .route('/')
    .post(signupController.setPassword)
    .patch(signupController.changePassword)

module.exports = router;