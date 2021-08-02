// npm install --save neo4j-driver
// node example.js
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "neo4j+s://6d86ab8c.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "yJ76GNUav3QAQDKOiwR4aMdCwgnWxurIty_6WH-g7aU"),
  {}
);
const query = `
MATCH(n:Patient{value:$patientId})-[r:medicalRecord]->(m:masterIdentifier{value:$recordName}) SET r.lastVisited = "ulalumpalu"`;

const session = driver.session({ database: "neo4j" });
var params = {
  recordName: "1627040983832",
  patientId: "20000101-794155",
  subjectIdentifierValue: "20000101-794155",
  masterIdentifierValue: "1626764008937",
  reportIdentifierValue: "104",
};
session
  .run(
    `MATCH(n:Socketuser) return n`
  )
  .then((result) => {
    if (result.records[0]) {
      var users = result.records.map(el => el._fields[0].properties)
      console.log(users)
      // console.log(result.records[1]._fields);
    } else {
      console.log({ message: "report not available" });
    }
  })
  .catch((err) => console.log(err));
module.exports = driver;
