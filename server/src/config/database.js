
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
async function initTables() {
  try {
    const conn = await pool.getConnection();

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        house_address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        order_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        order_type VARCHAR(50) NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        order_type VARCHAR(50)  NOT NULL
      )
    `);

    console.log("✅ Tables ensured");
    conn.release();
  } catch (err) {
    console.error("❌ Error ensuring tables:", err.message);
  }
}

initTables()

export default pool;
