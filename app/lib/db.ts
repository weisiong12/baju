import mysql from "mysql2/promise";
import { PRODUCTS_DATABASE, Product } from "../site/data/products";

// Create a connection pool to TiDB Cloud with SSL enabled
export const pool = mysql.createPool({
  host: process.env.TIDB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  port: Number(process.env.TIDB_PORT) || 4000,
  user: process.env.TIDB_USER || "4RPXAQWKtmangKn.root",
  password: process.env.TIDB_PASSWORD || "2naIpkJpxGTJooHD",
  database: process.env.TIDB_DATABASE || "homeboy",
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Database initialization helper to create products table and seed data
export async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    // 1. Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(32) NOT NULL,
        price VARCHAR(64) NOT NULL,
        price_number DECIMAL(10, 2) NOT NULL,
        sku VARCHAR(64) NOT NULL,
        type VARCHAR(32) NOT NULL,
        color_name VARCHAR(64) NOT NULL,
        color_hex VARCHAR(32) NOT NULL,
        front_badge VARCHAR(64) DEFAULT '01 / FRONT',
        sizes JSON NOT NULL,
        description JSON NOT NULL,
        sizing_notes TEXT,
        shipping_notes TEXT,
        swatches JSON,
        similar_product_ids JSON,
        stock INT DEFAULT 250,
        stock_allocation JSON,
        front_image TEXT,
        back_image TEXT,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Check if products table has rows
    const [rows]: [any[], any] = await connection.query("SELECT COUNT(*) as count FROM products");
    const count = rows[0]?.count || 0;

    // 3. Seed initial products if table is empty
    if (count === 0) {
      console.log("Seeding products database with initial catalog...");
      for (const prod of Object.values(PRODUCTS_DATABASE)) {
        await connection.query(
          `
          INSERT INTO products (
            id, name, category, price, price_number, sku, type, color_name, color_hex, front_badge,
            sizes, description, sizing_notes, shipping_notes, swatches, similar_product_ids
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            prod.id,
            prod.name,
            prod.category,
            prod.price,
            prod.priceNumber,
            prod.sku,
            prod.type,
            prod.colorName,
            prod.colorHex,
            prod.frontBadge,
            JSON.stringify(prod.sizes),
            JSON.stringify(prod.description),
            prod.sizingNotes,
            prod.shippingNotes,
            JSON.stringify(prod.swatches),
            JSON.stringify(prod.similarProductIds),
          ]
        );
      }
      console.log("Seeding completed successfully!");
    }

    // 4. Correct any legacy mis-categorized items in DB & ensure image columns exist
    try {
      await connection.query("ALTER TABLE products ADD COLUMN front_image TEXT");
    } catch (e) {
      // ignore
    }
    try {
      await connection.query("ALTER TABLE products ADD COLUMN back_image TEXT");
    } catch (e) {
      // ignore
    }
    try {
      await connection.query("ALTER TABLE products ADD COLUMN images JSON");
    } catch (e) {
      // ignore
    }
    try {
      await connection.query("UPDATE products SET category = 'HATS', type = 'hat' WHERE UPPER(name) LIKE '%HAT%' OR UPPER(category) IN ('HATS', 'HAT')");
      await connection.query("UPDATE products SET category = 'PANTS', type = 'shorts' WHERE UPPER(name) LIKE '%PANT%' AND category = 'TEES'");
    } catch (e) {
      // ignore
    }

    // 5. Create orders table for persistence
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        order_ref VARCHAR(64) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(64) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(128) NOT NULL,
        state VARCHAR(128) NOT NULL,
        postal_code VARCHAR(32) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        items JSON NOT NULL,
        status VARCHAR(32) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    return { success: true, message: "Database initialized successfully" };
  } catch (error: any) {
    console.error("Database initialization error:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Convert DB row to Product object
export function mapRowToProduct(row: any): Product {
  const parseJson = (val: any) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  };

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    priceNumber: Number(row.price_number),
    sku: row.sku,
    type: row.type,
    colorName: row.color_name,
    colorHex: row.color_hex,
    frontBadge: row.front_badge || "01 / FRONT",
    frontImage: row.front_image || null,
    backImage: row.back_image || null,
    images: parseJson(row.images) || [],
    sizes: parseJson(row.sizes) || ["S", "M", "L", "XL", "XXL"],
    description: parseJson(row.description) || [],
    sizingNotes: row.sizing_notes || "",
    shippingNotes: row.shipping_notes || "",
    swatches: parseJson(row.swatches) || [],
    similarProductIds: parseJson(row.similar_product_ids) || [],
    stock: row.stock !== null && row.stock !== undefined ? Number(row.stock) : 250,
    stockAllocation: parseJson(row.stock_allocation) || { S: 50, M: 50, L: 50, XL: 50, XXL: 50 },
  };
}
