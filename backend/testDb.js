import dotenv from 'dotenv';
dotenv.config();
console.log('DATABASE_URL in server:', process.env.DATABASE_URL);


import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT current_user, current_database();');
    console.log('Connected as:', res.rows[0]);
  } catch (err) {
    console.error('DB connection error:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
