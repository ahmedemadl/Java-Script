const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// 1. Connection Pool & Database Initialization
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', 
};

let pool;

async function initDB() {
  try {
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`retail_store\`;`);
    await tempConnection.end();

    pool = mysql.createPool({
      ...dbConfig,
      database: 'retail_store',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierName TEXT NOT NULL,
        ContactNumber TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Products (
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName TEXT NOT NULL,
        Price DECIMAL(10, 2) NOT NULL,
        StockQuantity INT NOT NULL,
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID) ON DELETE SET NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Sales (
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        ProductID INT,
        QuantitySold INT NOT NULL,
        SaleDate DATE NOT NULL,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
      );
    `);

    console.log('Database and Tables Initialized.');
  } catch (err) {
    console.error('Error initializing DB:', err);
  }
}

initDB();

// -------------------------------------------------------------
// 2. Products CRUD Endpoints
// -------------------------------------------------------------
app.post('/products', async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
      [ProductName, Price, StockQuantity, SupplierID]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products WHERE ProductID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    await pool.query(
      'UPDATE Products SET ProductName = ?, Price = ?, StockQuantity = ?, SupplierID = ? WHERE ProductID = ?',
      [ProductName, Price, StockQuantity, SupplierID, req.params.id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Products WHERE ProductID = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 3. Suppliers CRUD Endpoints
// -------------------------------------------------------------
app.post('/suppliers', async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    const [result] = await pool.query('INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)', [SupplierName, ContactNumber]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/suppliers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Suppliers');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/suppliers/:id', async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    await pool.query('UPDATE Suppliers SET SupplierName = ?, ContactNumber = ? WHERE SupplierID = ?', [SupplierName, ContactNumber, req.params.id]);
    res.json({ message: 'Supplier updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/suppliers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Suppliers WHERE SupplierID = ?', [req.params.id]);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 4. Sales Management Endpoints
// -------------------------------------------------------------
app.post('/sales', async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;
    const [result] = await pool.query('INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)', [ProductID, QuantitySold, SaleDate]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/sales', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sales');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/sales/product/:productId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sales WHERE ProductID = ?', [req.params.productId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 5. Database Modifications
// -------------------------------------------------------------
app.post('/alter/add-category', async (req, res) => {
  try {
    await pool.query('ALTER TABLE Products ADD COLUMN Category VARCHAR(255)');
    res.json({ message: 'Category column added to Products' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/alter/remove-category', async (req, res) => {
  try {
    await pool.query('ALTER TABLE Products DROP COLUMN Category');
    res.json({ message: 'Category column removed from Products' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/alter/modify-contact', async (req, res) => {
  try {
    await pool.query('ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)');
    res.json({ message: 'ContactNumber modified to VARCHAR(15)' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/alter/productname-notnull', async (req, res) => {
  try {
    await pool.query('ALTER TABLE Products MODIFY ProductName VARCHAR(255) NOT NULL');
    res.json({ message: 'ProductName set to NOT NULL' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 6. Data Insertion Endpoint
// -------------------------------------------------------------
app.post('/seed-data', async (req, res) => {
  try {
    const [supResult] = await pool.query('INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)', ['FreshFoods', '01001234567']);
    const supplierId = supResult.insertId;

    const [milkResult] = await pool.query('INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)', ['Milk', 15.00, 50, supplierId]);
    await pool.query('INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)', ['Bread', 10.00, 30, supplierId]);
    await pool.query('INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)', ['Eggs', 20.00, 40, supplierId]);

    const milkId = milkResult.insertId;
    await pool.query('INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)', [milkId, 2, '2025-05-20']);

    res.json({ message: 'Data seeded successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 7. Update Bread Price
// -------------------------------------------------------------
app.put('/products/bread/price', async (req, res) => {
  try {
    await pool.query('UPDATE Products SET Price = 25.00 WHERE ProductName = ?', ['Bread']);
    res.json({ message: "Bread price updated to 25.00" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 8. Delete Eggs Product
// -------------------------------------------------------------
app.delete('/products/eggs/delete', async (req, res) => {
  try {
    await pool.query('DELETE FROM Products WHERE ProductName = ?', ['Eggs']);
    res.json({ message: "Product 'Eggs' deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 9. Reporting: Total Quantity Sold Per Product
// -------------------------------------------------------------
app.get('/reports/total-sales-per-product', async (req, res) => {
  try {
    const query = `
      SELECT p.ProductID, p.ProductName, SUM(s.QuantitySold) AS TotalSold
      FROM Products p
      LEFT JOIN Sales s ON p.ProductID = s.ProductID
      GROUP BY p.ProductID, p.ProductName
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 10. Reporting: Highest Stock Quantity
// -------------------------------------------------------------
app.get('/reports/highest-stock', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 11. Reporting: Suppliers Starting with 'F'
// -------------------------------------------------------------
app.get('/reports/suppliers-starts-with-f', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 12. Reporting: Unsold Products
// -------------------------------------------------------------
app.get('/reports/unsold-products', async (req, res) => {
  try {
    const query = `
      SELECT p.* 
      FROM Products p 
      LEFT JOIN Sales s ON p.ProductID = s.ProductID 
      WHERE s.SaleID IS NULL
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 13. Reporting: Sales with JOIN (Product Name, Quantity, Date)
// -------------------------------------------------------------
app.get('/reports/sales-details', async (req, res) => {
  try {
    const query = `
      SELECT p.ProductName, s.QuantitySold, s.SaleDate
      FROM Sales s
      JOIN Products p ON s.ProductID = p.ProductID
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -------------------------------------------------------------
// 14, 15, 16. User & Permissions Administration
// -------------------------------------------------------------
app.post('/admin/setup-store-manager', async (req, res) => {
  try {
    // 14. Create user & grant SELECT, INSERT, UPDATE on all tables in retail_store
    await pool.query("CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'password123';");
    await pool.query("GRANT SELECT, INSERT, UPDATE ON retail_store.* TO 'store_manager'@'localhost';");

    // 15. Revoke UPDATE
    await pool.query("REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost';");

    // 16. Grant DELETE strictly on Sales table
    await pool.query("GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost';");

    await pool.query("FLUSH PRIVILEGES;");

    res.json({ message: "User 'store_manager' configured with required permissions." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
