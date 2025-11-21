// db.ts
import sql, { ConnectionPool, config as SQLConfig } from "mssql"

export interface Product {
 id: number
  Title: string
  price: number
  image: string
  categoryId: number
}
export interface Category {
  id: number
  name: string
}

export interface RestaurantInfo {
  id: number
  name: string
  tagline: string
  logoUrl: string
  phone: string
}

const config: SQLConfig = {
  user: "db_abece2_ecommerce_admin",
  password: "Mobark12.",
  server: "sql6030.site4now.net",            // or "ALBAHRI\\SQLEXPRESS"
  database: "db_abece2_ecommerce",         // your DB name
  // port: 1433,                // uncomment if you set a custom port
  options: {
    encrypt: false,             // local/on-prem
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  // connectionTimeout: 15000,
  // requestTimeout: 15000,
}

// --- Reuse a single pool (important for Next.js / serverless) ---
let poolPromise: Promise<sql.ConnectionPool> | null = null
async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config)
  }
  return poolPromise
}

export async function getProducts(): Promise<Product[]> {
  const pool = await getPool()
  const r = await pool.request().query(`
    SELECT id, Title, price, image, categoryId
    FROM dbo.Products
    ORDER BY id
  `)
  return r.recordset as Product[]
}

export async function getCategories(): Promise<Category[]> {
  const pool = await getPool()
  const r = await pool.request().query(`
    SELECT id, name
    FROM dbo.Categories
    ORDER BY id
  `)
  return r.recordset as Category[]
}

export async function getRestaurantInfo(): Promise<RestaurantInfo | null> {
  const pool = await getPool()
  const result = await pool.request().query(`
    SELECT TOP 1 id, name, tagline, logoUrl , phone
    FROM dbo.RestaurantInfo
  `)
  return result.recordset[0] || null
}

let pool: ConnectionPool | null = null

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}

