// npm install --save neo4j-driver
// node example.js
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://54.172.123.120:7687',
                  neo4j.auth.basic('neo4j', 'menu-harmonies-capacity'), 
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