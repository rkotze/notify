const { Client } = require("pg");
const config = require("config");

function getDbKeys() {
  try {
    return config.get("notifyDatabase");
  } catch (e) {
    console.log("Could not get notifty db config", e);
  }
}

module.exports = function dbClient(){
  return new Client(getDbKeys());
}