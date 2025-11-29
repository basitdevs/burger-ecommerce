import sql, { config as SQLConfig, ConnectionPool } from "mssql";

export interface Product {
  id: number;
  Title: string;
  price: number;
  image: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
}

// Updated Interface to include address and email
export interface RestaurantInfo {
  id: number;
  name: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  address: string;
  email: string;
}

// SQL Server config
const config: SQLConfig = {
  user: "db_abece2_ecommerce_admin",
  password: "Mobark12.",
  server: "sql6030.site4now.net",
  database: "db_abece2_ecommerce",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

let poolPromise: Promise<ConnectionPool> | null = null;

async function getPool(): Promise<ConnectionPool> {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

export const getConnection = getPool;

export async function getProducts(): Promise<Product[]> {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT id, Title, price, image, categoryId
    FROM dbo.Products
    ORDER BY id
  `);
  return result.recordset as Product[];
}

export async function getCategories(): Promise<Category[]> {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT id, name
    FROM dbo.Categories
    ORDER BY id
  `);
  return result.recordset as Category[];
}

export async function getRestaurantInfo(): Promise<RestaurantInfo | null> {
  const pool = await getPool();
  // Added address and email to the SELECT statement
  const result = await pool.request().query(`
    SELECT TOP 1 id, name, tagline, logoUrl, phone, address, email
    FROM dbo.RestaurantInfo
  `);
  return result.recordset[0] || null;
}