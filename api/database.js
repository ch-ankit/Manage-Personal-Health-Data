// npm install --save neo4j-driver
// node example.js
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://18.212.64.201:7687",
  neo4j.auth.basic("neo4j", "techniques-sights-rock"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);
const query = `
Merge(n:trial{name:$person[0].name})`;

const session = driver.session({ database: "neo4j" });
var params = {
  person: [
    {
      name: "kyale",
    },
  ],
};
// session
//   .run(query, params)
//   .then((result) => {
//     result.records.forEach((record) => {
//       // record.forEach((el) => console.log(el.properties));
//     });
//     session.close();
//   })
//   .catch((error) => {
//     console.error(error);
//   });
module.exports = driver;
