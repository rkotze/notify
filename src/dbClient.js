const { Client } = require("pg");
const config = require("config");

function getDbKeys() {
  try {
    return config.get("notifyDatabase");
  } catch (e) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    };
  }
}

module.exports = function dbClient(){
  return new Client(getDbKeys());
}