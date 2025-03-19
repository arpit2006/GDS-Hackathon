// Basic server for Farm Fresh Marketplace
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Data storage - in a real app, this would be a database
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Initialize data files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}

// Helper functions for data access
function readData(file) {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return [];
    }
}

function writeData(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${file}:`, error);
        return false;
    }
}

// Authentication routes
app.post('/api/auth/register', (req, res) => {
    const users = readData(USERS_FILE);
    const { email, password, fullname, mobile, isFarmer, farmName, farmAddress, farmType } = req.body;
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        fullname,
        mobile,
        isFarmer,
        farmName,
        farmAddress,
        farmType,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    if (writeData(USERS_FILE, users)) {
        // Don't return the password
        const { password, ...userWithoutPassword } = newUser;
        res.status(201).json({ success: true, user: userWithoutPassword });
    } else {
        res.status(500).json({ success: false, message: 'Failed to register user' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const users = readData(USERS_FILE);
    const { email, password, isFarmer } = req.body;
    
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (user.isFarmer !== isFarmer) {
        return res.status(401).json({ success: false, message: 'Invalid user type' });
    }
    
    // Don't return the password
    const { password: userPassword, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
});

// Product routes
app.get('/api/products', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    res.json({ success: true, products });
});

app.post('/api/products', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const { name, category, price, quantity, unit, description, status, farmerId, farmerName } = req.body;
    
    const newProduct = {
        id: 'PROD-' + Date.now(),
        name,
        category,
        price,
        quantity,
        unit,
        description,
        status,
        farmerId,
        farmerName,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    if (writeData(PRODUCTS_FILE, products)) {
        res.status(201).json({ success: true, product: newProduct });
    } else {
        res.status(500).json({ success: false, message: 'Failed to add product' });
    }
});

app.get('/api/products/:id', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
});

app.put('/api/products/:id', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const { name, category, price, quantity, unit, description, status } = req.body;
    
    // Update product
    products[index] = {
        ...products[index],
        name: name || products[index].name,
        category: category || products[index].category,
        price: price || products[index].price,
        quantity: quantity || products[index].quantity,
        unit: unit || products[index].unit,
        description: description || products[index].description,
        status: status || products[index].status,
        updatedAt: new Date().toISOString()
    };
    
    if (writeData(PRODUCTS_FILE, products)) {
        res.json({ success: true, product: products[index] });
    } else {
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    if (products.length === filteredProducts.length) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    if (writeData(PRODUCTS_FILE, filteredProducts)) {
        res.json({ success: true, message: 'Product deleted successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
});

// Order routes
app.post('/api/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const { products, buyerId, buyerName, buyerAddress, totalAmount } = req.body;
    
    const newOrder = {
        id: 'ORD-' + Date.now(),
        products,
        buyerId,
        buyerName,
        buyerAddress,
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    if (writeData(ORDERS_FILE, orders)) {
        res.status(201).json({ success: true, order: newOrder });
    } else {
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

app.get('/api/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const { buyerId, farmerId } = req.query;
    
    let filteredOrders = orders;
    
    if (buyerId) {
        filteredOrders = filteredOrders.filter(order => order.buyerId === buyerId);
    }
    
    if (farmerId) {
        filteredOrders = filteredOrders.filter(order => 
            order.products.some(product => product.farmerId === farmerId)
        );
    }
    
    res.json({ success: true, orders: filteredOrders });
});

app.put('/api/orders/:id/status', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const index = orders.findIndex(o => o.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const { status } = req.body;
    
    // Update order status
    orders[index] = {
        ...orders[index],
        status,
        updatedAt: new Date().toISOString()
    };
    
    if (writeData(ORDERS_FILE, orders)) {
        res.json({ success: true, order: orders[index] });
    } else {
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
}); 