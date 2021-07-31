const driver = require("./../database");

(async () => {
  var session = driver.session();
  var query = `MATCH (n:Practitioner{value:$doctorId})-[r:hasAcess]->(m)
               MATCH (n1:Patient{value:r.patientId})-[r1:hasName]->(m1) 
               MATCH (n1)-[r2:photo]->(m2:photo) 
               return n1.value,m1,m2.url,r.acessedDate ORDER BY r.timeStamp DESC
                `;
  session
    .run(query, { doctorId: "777333", patientId: "20000707-513569" })
    .then((result) => {
      var returnData = {};
      var nameObj = result.records[0]._fields[1].properties;
      returnData.name = `${nameObj.prefix}.${nameObj.given[0]} ${
        nameObj.given[1] === "" ? "" : `${nameObj.given[1]} `
      }${nameObj.family}${nameObj.suffix == "" ? "" : `,${nameObj.suffix}`}`;
      returnData.value = result.records[0]._fields[0];
      returnData.photo = result.records[0]._fields[2];
      returnData.visitDate = result.records[0]._fields[3];
      console.log(returnData);
    });
})();
