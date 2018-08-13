const dbClient = require('./dbClient');

async function insert([name, sub, granted, endpoint, expirationTime, keyp256dh, keyAuth]) {
  const client = dbClient();
  await client.connect();

  const insertQuery = `INSERT INTO users( name, category, granted, endpoint, expirationTime, keyp256dh, keyAuth) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`;
  const values = [name, sub, granted, endpoint, expirationTime, keyp256dh, keyAuth];

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