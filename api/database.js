// npm install --save neo4j-driver
// node example.js
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('neo4j+s://6d86ab8c.databases.neo4j.io',
                  neo4j.auth.basic('neo4j', 'yJ76GNUav3QAQDKOiwR4aMdCwgnWxurIty_6WH-g7aU'), 
                  {});
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
