const mysql = require('mysql2/promise');

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: Number(process.env.TIDB_PORT) || 4000,
    user: process.env.TIDB_USER || '4RPXAQWKtmangKn.root',
    password: process.env.TIDB_PASSWORD || '2naIpkJpxGTJooHD',
    database: process.env.TIDB_DATABASE || 'homeboy',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });

  try {
    await conn.query("ALTER TABLE products ADD COLUMN stock INT DEFAULT 250");
    console.log("Added column stock");
  } catch (e) {
    console.log("Column stock note:", e.message);
  }

  try {
    await conn.query("ALTER TABLE products ADD COLUMN stock_allocation JSON");
    console.log("Added column stock_allocation");
  } catch (e) {
    console.log("Column stock_allocation note:", e.message);
  }

  const defaultStockAlloc = JSON.stringify({ S: 50, M: 50, L: 50, XL: 50, XXL: 50 });
  await conn.query("UPDATE products SET stock = 250 WHERE stock IS NULL");
  await conn.query("UPDATE products SET stock_allocation = ? WHERE stock_allocation IS NULL", [defaultStockAlloc]);
  console.log("Migration finished successfully!");

  const [cols] = await conn.query("DESCRIBE products");
  console.log("Current columns:", cols.map(c => c.Field));

  const [rows] = await conn.query("SELECT id, name, stock, stock_allocation FROM products LIMIT 3");
  console.log("Sample rows:", rows);

  await conn.end();
}

migrate().catch(console.error);
