import sql, { config as SQLConfig, ConnectionPool } from "mssql";

export interface Product {
  id: number;
  Title: string;
  Title_ar?: string;
  price: number;
  image: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  name_ar?: string;
}

export interface RestaurantInfo {
  id: number;
  name: string;
  name_ar?: string;
  tagline: string;
  tagline_ar?: string;
  logoUrl: string;
  phone: string;
  address: string;
  address_ar?: string;
  email: string;
}

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
    SELECT id, Title, Title_ar, price, image, categoryId
    FROM dbo.Products
    ORDER BY id
  `);

  return result.recordset as Product[];
}

export async function getCategories(): Promise<Category[]> {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT id, name, name_ar
    FROM dbo.Categories
    ORDER BY id
  `);

  return result.recordset as Category[];
}

export async function getRestaurantInfo(): Promise<RestaurantInfo | null> {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT TOP 1 
      id, 
      name, name_ar, 
      tagline, tagline_ar, 
      logoUrl, 
      phone, 
      address, address_ar, 
      email
    FROM dbo.RestaurantInfo
  `);

  return result.recordset[0] || null;
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  return getProducts();
}

export async function getAllCategoriesForAdmin(): Promise<Category[]> {
  return getCategories();
}

export async function getRestaurantInfoForAdmin(): Promise<RestaurantInfo | null> {
  return getRestaurantInfo();
}
