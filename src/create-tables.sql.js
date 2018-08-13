const dbClient = require('./dbClient');

async function createUsersTable() {
  const client = dbClient();
  await client.connect();

  const res = await client.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY     NOT NULL,
      name           VARCHAR(200)    NOT NULL,
      category       VARCHAR(200),
      granted        BOOLEAN,
      endpoint       VARCHAR(400),
      expirationTime TIMESTAMP,
      keyp256dh      VARCHAR(200),
      keyAuth        VARCHAR(200)
  );
  `);
  console.log(res);
  await client.end();
}

async function run() {
  await createUsersTable();
}

run();