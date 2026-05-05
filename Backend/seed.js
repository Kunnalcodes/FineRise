const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("./models/users");
const Product = require("./models/product");
const Store = require("./models/store");
const { main: connectDB } = require("./models/index");

async function seed() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    // Wait a bit for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Seeding process started...");

    // 1. Create or Find the Default User
    let user = await User.findOne({ email: "admin@finerise.com" });
    if (!user) {
      console.log("Creating default admin user...");
      user = new User({
        firstName: "FineRise",
        lastName: "Admin",
        email: "admin@finerise.com",
        password: "admin123",
        phoneNumber: 1234567890,
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=FineRise",
      });
      await user.save();
      console.log("User created: admin@finerise.com / admin123");
    } else {
      console.log("Using existing admin user.");
    }

    const userID = user._id;

    // 2. Seed Stores
    console.log("Reading stores CSV...");
    const storesData = fs.readFileSync(path.join(__dirname, "seed_stores.csv"), "utf-8");
    const storeLines = storesData.split("\n").slice(1); // skip header
    
    for (let line of storeLines) {
      if (!line.trim()) continue;
      const [name, category, address, city] = line.split(",");
      
      const existingStore = await Store.findOne({ name, userID });
      if (!existingStore) {
        const newStore = new Store({
          userID,
          name,
          category,
          address,
          city,
          image: "https://api.dicebear.com/7.x/shapes/svg?seed=" + name
        });
        await newStore.save();
        console.log(`Store added: ${name}`);
      }
    }

    // 3. Seed Products
    console.log("Reading products CSV...");
    const productsData = fs.readFileSync(path.join(__dirname, "seed_products.csv"), "utf-8");
    const productLines = productsData.split("\n").slice(1);
    
    for (let line of productLines) {
      if (!line.trim()) continue;
      const parts = line.split(",");
      const name = parts[0];
      const manufacturer = parts[1];
      const stock = parseInt(parts[2]);
      const description = parts.slice(3).join(",");
      
      const existingProduct = await Product.findOne({ name, userID });
      if (!existingProduct) {
        const newProduct = new Product({
          userID,
          name,
          manufacturer,
          stock,
          description
        });
        await newProduct.save();
        console.log(`Product added: ${name}`);
      }
    }

    // 4. Seed Sales
    console.log("Reading sales CSV...");
    const Sales = require("./models/sales");
    const salesData = fs.readFileSync(path.join(__dirname, "seed_sales.csv"), "utf-8");
    const salesLines = salesData.split("\n").slice(1);
    
    for (let line of salesLines) {
      if (!line.trim()) continue;
      const [productName, storeName, stockSold, saleDate, amount] = line.split(",");
      
      const product = await Product.findOne({ name: productName, userID });
      const store = await Store.findOne({ name: storeName, userID });
      
      if (product && store) {
        // Check if this sale already exists (simple check by date and product/store)
        const existingSale = await Sales.findOne({ 
          userID, 
          ProductID: product._id, 
          StoreID: store._id, 
          SaleDate: saleDate 
        });

        if (!existingSale) {
          const newSale = new Sales({
            userID,
            ProductID: product._id,
            StoreID: store._id,
            StockSold: parseInt(stockSold),
            SaleDate: saleDate,
            TotalSaleAmount: parseInt(amount)
          });
          await newSale.save();
          console.log(`Sale added: ${productName} at ${storeName}`);
        }
      } else {
        console.warn(`Could not find product or store for sale: ${line}`);
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
