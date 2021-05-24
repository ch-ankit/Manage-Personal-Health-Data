var neo4j = require("neo4j-driver");

var driver = neo4j.driver(
  "bolt://54.160.58.19:7687",
  neo4j.auth.basic("neo4j", "aggravation-representative-bushes")
);

module.exports = driver;
