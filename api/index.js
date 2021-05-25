var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var path = require('path');
const cors = require('cors')

const database = require('./database');
const signupRouter = require("./routes/signup")
const loginRouter = require("./routes/login")
const passwordRouter = require("./routes/password")
require("dotenv").config({ path: "./config.env" });
app.use(cors())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/password", passwordRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log({
    data: {
      title: '💥💥💥ERROR💥💥💥',
      message: `:: ${err.message}`,
      error: err,
      status: err.status || 500
    }
  })
});



module.exports = app;