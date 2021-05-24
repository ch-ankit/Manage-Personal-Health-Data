// npm install --save neo4j-driver
// node example.js
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://54.173.247.57:7687',
                  neo4j.auth.basic('neo4j', 'accesses-barrel-evaporation'), 
                  {});

const query =
  `
  MATCH (n)
  RETURN COUNT(n) AS count
  LIMIT $limit
  `;

const params = {"limit": 10};

const session = driver.session({database:"neo4j"});

session.run(query, params)
  .then((result) => {
    result.records.forEach((record) => {
        // console.log(record.get('count'));
    });
    session.close();
  })
  .catch((error) => {
    console.error(error);
  });
module.exports = driver;