const dbClient = require('./dbClient');

async function createUsersTable() {
  const client = dbClient();
  await client.connect();

  const res = await client.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY     NOT NULL,
      name           CHAR(200)    NOT NULL,
      category       CHAR(200),
      granted        BOOLEAN,
      endpoint       CHAR(400),
      expirationTime TIMESTAMP,
      keyp256dh      CHAR(200),
      keyAuth        CHAR(200)
  );
  `);
  console.log(res);
  await client.end();
}

async function run() {
  await createUsersTable();
}

run();