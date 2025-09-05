
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.query("SELECT 1")
  .then(() => console.log("✅ MySQL Connected"))
  .catch((err) => console.error("❌ DB Error:", err.message, err.code));

export default pool;
