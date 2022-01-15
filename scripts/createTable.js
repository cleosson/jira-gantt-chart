const { Client } = require('pg');

const client = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT, 10),
});

const executeSQL = async (queries) => {
  try {
    await client.connect();     // gets connection
    for (const query of queries) {
      await client.query(query);
    }
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  } finally {
    await client.end();         // closes connection
  }
};

const sqls = [
  `
    DROP TABLE IF EXISTS
      issue,
      epic,
      sprint,
      board;
  `,
  `
    CREATE TABLE IF NOT EXISTS "board" (
    "id" INT,
    "name" VARCHAR(100) NOT NULL,
    PRIMARY KEY ("id"));
  `,
  `
    CREATE TABLE IF NOT EXISTS "sprint" (
    "id" INT,
    "board_id" INT REFERENCES board (id),
    "name" VARCHAR(100) NOT NULL,
    "start_date" VARCHAR(100) NOT NULL,
    "complete_date" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    PRIMARY KEY ("id"));
  `,
  `
    CREATE TABLE IF NOT EXISTS "epic" (
    "id" INT,
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "parent_id" INT REFERENCES epic (id),
    "board_id" INT REFERENCES board (id),
    PRIMARY KEY ("id"));
  `,
  `
    CREATE TABLE IF NOT EXISTS "issue" (
    "id" INT,
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "done" BOOLEAN NOT NULL,
    "board_id"  INT REFERENCES board (id),
    PRIMARY KEY ("id"));
  `
];

executeSQL(sqls).then(result => {
  if (result) {
    console.log('Tables created');
  }
});
