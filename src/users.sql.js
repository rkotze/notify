const dbClient = require('./dbClient');

async function insert() {
  const client = dbClient();
  await client.connect();

  const insertQuery = `INSERT INTO users( name, category, granted, endpoint, expirationTime, keyp256dh, keyAuth) 
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

  const res = await client.query(insertQuery, values);
  await client.end();
  return res;
}

async function getAll() {
  const client = dbClient();
  await client.connect();

  const text = `SELECT * FROM users`;

  const res = await client.query(text);
  await client.end();
  return res;
}

module.exports = {
  insert,
  getAll
};