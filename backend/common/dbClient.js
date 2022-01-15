import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT, 10),
});

const Query = async (query) => {
  const client = await pool.connect()

  try {
    return await client.query(query);
  } catch (error) {
    console.error(error.stack);
    return null;
  } finally {
    client.release();
  }
};

export {Query}