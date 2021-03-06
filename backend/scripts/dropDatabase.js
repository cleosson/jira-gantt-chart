import 'dotenv/config';
import pg from 'pg';

const client = new pg.Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT, 10),
});

const executeSQL = async (query) => {
  try {
    await client.connect();     // gets connection
    await client.query(query);  // sends queries
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  } finally {
    await client.end();         // closes connection
  }
};

const sql = "DROP DATABASE IF EXISTS " + process.env.POSTGRES_DATABASE

executeSQL(sql).then(result => {
  if (result) {
    console.log('Database dropped');
  }
});