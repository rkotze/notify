const { Client } = require("pg");
const config = require("config");

function getDbKeys() {
  try {
    return config.get("notifyDatabase");
  } catch (e) {
    console.log("Could not get notifty db config", e);
  }
}

async function createUsersTable() {
  const client = new Client(getDbKeys());
  await client.connect();

  const res = await client.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY     NOT NULL,
      name           CHAR(200)    NOT NULL,
      category       CHAR(200),
      granted        BOOLEAN,
      endpoint       CHAR(200),
      expirationTime TIMESTAMP,
      keyp256dh      CHAR(200),
      keyAuth        CHAR(200)
  );
  `);
  console.log(res);
  await client.end();
}

async function insert() {
  const client = new Client(getDbKeys());
  await client.connect();

  const text = `INSERT INTO users( name, category, granted, endpoint, expirationTime, keyp256dh, keyAuth) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`;
  const values = [
    "brianc",
    "sub",
    true,
    "AKSFEW342ks",
    "1999-01-08 04:05:06",
    "asdf8we",
    "aeiieiwwe883"
  ];

  const res = await client.query(text, values);
  console.log(res);
  await client.end();
}

async function run() {
  await createUsersTable();
  await insert();
}

run();