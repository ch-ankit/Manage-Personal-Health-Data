const nodemailer = require("nodemailer");
exports.sendMail = (recieverMail,mailText,next)=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourbusinessanalyst2020@gmail.com',
      pass: 'neo@2020'
    }
  });
  
  var mailOptions = {
    from: 'MPHD',
    to: recieverMail,
    subject: '',
    text: mailText  
  };
  
  transporter.sendMail(mailOptions,error=>{
    if (error) {
      next(error);
    }
  });
}
