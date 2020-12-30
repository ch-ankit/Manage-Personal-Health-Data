var driver = require("./../connection");
var session = driver.session();

//signup for doctor/patient/co-ordinator/director

router.post("/",(req, res, next)=>{
    var query = "MATCH (n:person){id : $id} RETURN n.id as idAlreadyExits"
    session.run(query,{
        id=req.body.id
    })
    .then((result) => {
        result.records.forEach((record) => {
          console.log(record.get("name"));
        });
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => session.close());
});
