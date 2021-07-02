// npm install --save neo4j-driver
// node example.js
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://44.193.79.183:7687',
                  neo4j.auth.basic('neo4j', 'detonations-pushdowns-reactors'), 
                  {});
const query = `
MATCH(n:Patient)-[r1:telecom]->(m2) return n,r1,m2`;

const session = driver.session({ database: "neo4j" });

session
  .run(query)
  .then((result) => {
    result.records.forEach((record) => {
      // record.forEach((el) => console.log(el.properties));
    });
    session.close();
  })
  .catch((error) => {
    console.error(error);
  });
module.exports = driver;
