// server.js - Starter Express server for Week 2 assignment

// .env variables
require("dotenv").config();

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const products = require("./products");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// mongo db setup
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));

// Middleware setup
app.use(bodyParser.json());
app.use(requestLogger);

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Product API! Go to /api/products to see all products."
  );
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get("/api/products", async (req, res) => {
  try {
    const product = await products.find();
    res.status(200).send(product);
    console.log("retrieved all products");
  } catch (error) {
    res.status(500).send(`A ${error} occured!`);
  }
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await products.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.status(200).send(product);
    console.log("retrieved a product");
  } catch (error) {
    res.status(500).send(`A ${error} occured!`);
  }
});

// POST /api/products - Create a new product
app.post("/api/products", async (req, res) => {
  try {
    const product = new products(req.body);
    await product.save();
    res.status(200).send(product);
    console.log("Added a product!");
  } catch (error) {
    res.status(500).send(`A ${error} occured!`);
  }
});
// PUT /api/products/:id - Update a product
app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).send();
    res.send(product);
  } catch (error) {
    res.status(500).send("product not updated");
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await products.findByIdAndDelete(req.params.id);
    if(!product) return res.status(404).send();
    res.send(product);
  } catch (error) {
    res.status(500).send("product not deleted");
  }
})

// Example route implementation for GET /api/products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
const requestLogger = function (req, res, next) {
  const time = Date.now();
  console.log(`A ${req.method} request happened at ${time} at ${req.path}`);
}
// - Authentication
// - Error handling

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
