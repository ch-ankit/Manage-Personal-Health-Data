var driver = require("../connection");

//signup for doctor/patient/co-ordinator/director


// function next(e){
//   console.log(e)
// }
exports.getHomPage =
  (req, res, next) => {
    var session = driver.session();
    var data = [];
    var label = "hospital";
    var query = `Match (m:department) RETURN m`;
    session
      .run(query)
      .then((result) => {
        result.records.forEach((record) => {
          data.push(record._fields[0].properties);
        });
        res.send(data);
        session.close()
      })
      .catch((error) => {
        next(error);
      })
  };

//   var a={}
//   var b={
//      send(x){
//       console.log(x)
//     }
//   }
//  getHomPage(a,b,next)