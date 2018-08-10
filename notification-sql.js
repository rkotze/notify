const { Client } = require('pg')

async function query(){
  const client = new Client({
    user: 'notify_admin',
    host: 'localhost',
    database: 'notify',
    password: '123456',
    port: 5432,
  });
  await client.connect()

  const res = await client.query(`CREATE TABLE IF NOT EXISTS users(
      id INT PRIMARY KEY     NOT NULL,
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

query();
