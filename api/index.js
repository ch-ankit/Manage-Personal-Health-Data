var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var path = require("path");
const cors = require("cors");

const database = require("./database");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const passwordRouter = require("./routes/password");
const medicalReportRouter = require("./routes/medicalReport");
const medicalRecordRouter = require("./routes/medicalRecord");
const searchRouter = require("./routes/search");
const lastVisitedRouter = require("./routes/lastVisited");
const shareRouter = require("./routes/share");
const doctorRouter = require("./routes/doctor");
const personalRouter = require("./routes/personal");

require("dotenv").config({ path: "./config.env" });
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/password", passwordRouter);
app.use("/report", medicalReportRouter);
app.use("/record", medicalRecordRouter);
app.use("/search", searchRouter);
app.use("/lastVisited", lastVisitedRouter);
app.use("/share", shareRouter);
app.use("/doctor", doctorRouter);
app.use("/perosnal", personalRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log({
    data: {
      title: "💥💥💥ERROR💥💥💥",
      message: `:: ${err.message}`,
      error: err,
      status: err.status || 500,
    },
  });
});

module.exports = app;
