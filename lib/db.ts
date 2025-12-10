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

export interface ShippingDetails {
  name: string;
  phone: string;
  email: string;
  area: string;
  block: string;
  street: string;
  house: string;
  avenue?: string;
  specialDirections?: string;
}

export interface OrderItemInput {
  Title: string;
  Title_ar?: string;
  qty: number;
  price: number;
  image: string;
}

export interface CreateOrderInput {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: ShippingDetails; // This matches your form data
  totalAmount: number;
  items: OrderItemInput[];
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


export async function createOrder(data: CreateOrderInput): Promise<boolean> {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // We store the full shipping object as a JSON string in the 'address' column
    // This ensures Area, Block, Directions, etc. are never lost.
    const addressJson = JSON.stringify(data.address);

    const orderRequest = new sql.Request(transaction);
    const orderResult = await orderRequest
      .input("paymentId", sql.NVarChar, data.paymentId)
      .input("customerName", sql.NVarChar, data.customerName)
      .input("customerEmail", sql.NVarChar, data.customerEmail)
      .input("customerPhone", sql.NVarChar, data.customerPhone)
      .input("address", sql.NVarChar, addressJson) // <--- SAVES ALL DETAILS
      .input("totalAmount", sql.Decimal(18, 3), data.totalAmount)
      .query(`
        INSERT INTO dbo.Orders 
        (paymentId, customerName, customerEmail, customerPhone, address, totalAmount, status)
        VALUES 
        (@paymentId, @customerName, @customerEmail, @customerPhone, @address, @totalAmount, 'PAID');
        SELECT SCOPE_IDENTITY() AS id;
      `);

    const newOrderId = orderResult.recordset[0].id;

    for (const item of data.items) {
      const itemRequest = new sql.Request(transaction);
      await itemRequest
        .input("orderId", sql.Int, newOrderId)
        .input("productName", sql.NVarChar, item.Title)
        .input("productNameAr", sql.NVarChar, item.Title_ar || item.Title)
        .input("quantity", sql.Int, item.qty)
        .input("price", sql.Decimal(18, 3), item.price)
        .input("image", sql.NVarChar, item.image)
        .query(`
          INSERT INTO dbo.OrderItems 
          (orderId, productName, productNameAr, quantity, price, image)
          VALUES 
          (@orderId, @productName, @productNameAr, @quantity, @price, @image)
        `);
    }

    await transaction.commit();
    console.log(`✅ Order #${newOrderId} saved with full shipping details.`);
    return true;

  } catch (err) {
    console.error("❌ Error saving order:", err);
    await transaction.rollback();
    throw err;
  }
}