// npm install --save neo4j-driver
// node example.js
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "neo4j+s://6d86ab8c.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "yJ76GNUav3QAQDKOiwR4aMdCwgnWxurIty_6WH-g7aU"),
  {}
);
const query = ` MATCH(n:Patient) RETURN n.value`;

const session = driver.session({ database: "neo4j" });

var params = {
  recordName: "1627040983832",
  patientId: "20000101-794155",
  subjectIdentifierValue: "20000101-794155",
  masterIdentifierValue: "1626764008937",
  reportIdentifierValue: "104",
};
session
  .run(query)
  .then((result) => {
    result.records.forEach((el) => {
      console.log(el._fields);
    });
  })
  .catch((err) => console.log(err));
module.exports = driver;
