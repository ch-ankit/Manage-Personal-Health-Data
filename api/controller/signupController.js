const { json } = require("express");
var driver = require("./../connection");
var session = driver.session();

//signup for doctor/patient/co-ordinator/director

function oldCheck(label,id,next){
  var session = driver.session();
  var postion = label
  var query1 = `MATCH (n:${postion}{employeeId:$id}) RETURN n`;
  session
    .run(query1,{
      id:id,
      // label:postion,
    })
    .then((result) => {
      if (result.records[0] !== undefined) {
        console.log("hello")
        session.close();
        console.log("hello")
        return true;
      } else{
        console.log(result)
        session.close();
        return true;
      }
      
    }).catch((err)=>{
      next(err);
    })
    
}
exports.signup =  async (req, res, next) => {
   var x = await oldCheck(req.query.position,req.body.id,next)
  // var query = `MATCH (n:${req.query.position}{employeeId:$id}) RETURN n.employeeId`;
  console.log(x)
  if( oldCheck(req.query.position,req.body.id,next) ){
       var session = driver.session();
       var query = `MERGE (n:person:staff:$position{employeeId:$id,name:$name,address:$address,contactNo:$contactNo,degree:$degree,email:$email,jobType:$jobType})-[r:worksAt{since:"",authoritylevel:"4"}]->(m:department{name:"${req.body.department}"})`;
        // if (req.query.position === "patient") query = `MERGE (n:person:${req.query.position}) RETURN n.employeeId`;
          session
          .run(query, {
            position:req.query.position,
            id:req.body.id,
            name:req.body.name,
            address:req.body.address,
            contactNo:req.body.contactNo,
            degree:req.body.degree,
            email:req.body.email,
            jobtype:req.body.jobType,
          })
          .then((result) => {
            result.records.forEach((record) => {});
          })
          .catch((error) => {
            next(error);
          });
          var message = "Signup Successfull";
  }else{
       var message= "Already2 registered id check again"
  }
  res.send({ data: message });
};

//login

exports.login = (req, res, next) => {
  var session = driver.session();
  var label = "person";
  var query = `MATCH (n:${label} {employeeId : $empId}) RETURN n AS results`;
  var result1 = [];
  session
    .run(query, {
      empId: `${req.body.id}`,
    })
    .then((result) => {
      result.records.forEach((record) => {
        result1.push(
          record._fields[0].properties.name,
          record._fields[0].properties.email,
          record._fields[0].properties.contactNo,
          record._fields[0].properties.address,
          record._fields[0].labels.pop()
        );
      });
      res.send({ data: result1 });
      session.close();
    })
    .catch((err) => {
      next(err);
    });
};

