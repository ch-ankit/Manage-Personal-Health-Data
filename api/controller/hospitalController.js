var driver = require("./../connection");

exports.setUp = (req, res, next) => {
    var session = driver.session();
    var query = ` Merge (n:hospital{name:$name,address:$address,contactInfo:$contactInfo,email:$email,specialization:$specialization,estDate:$estDate,})`;
    session
      .run(query, {
        name:req.body.name,
        address:req.body.address,
        contactInfo:req.body.contactInfo,
        email:req.body.email,
        specialization:req.body.specialization,
        estDate:req.body.estDate,
      })
      .then(()=>{
           res.send({message:"data added"});
           session.close()
      })
      .catch((error) => {
        next(error);
      });
  };
  
exports.getHospitalInfo = (req, res, next) => {
    var session = driver.session();
    var query = ` Match (n:hospital{name:$name}) return n`;
    session
      .run(query, {
        name:req.query.name,
      })
      .then((results)=>{
          var info = results.records[0]._fields[0].properties
          res.send(info);
          session.close();
        })
      .catch((error) => {
        next(error);
      });
  };

exports.addDepartment = (req, res, next) => {
    var session = driver.session();
    var query = `Match (n:hpspital(name:$hName)) Merge (m:department{name:$name,blockNo:$blockNo,contactInfo:$contactInfo,email:$email})-[r:belognsTo{since:$estDate}]-(n)`;
    session
      .run(query, {
        hname:req.body.hname,
        name:req.body.name,
        blockNo:req.body.blockNo,
        contactInfo:req.body.contactInfo,
        email:req.body.email,
        estDate:req.body.estDate,
        })
      .then(()=>{
           res.send({message:"department added"});
           session.close()
      })
      .catch((error) => {
        next(error);
      });
  };

exports.getDepartmentInfo = (req, res, next) => {
    var session = driver.session();
    var query = ` Match (n:deparment{name:$name}) return n`;
    session
      .run(query, {
        name:req.query.name,
      })
      .then((results)=>{
          var info = results.records[0]._fields[0].properties
          res.send(info);
          session.close();
        })
      .catch((error) => {
        next(error);
      });
  };