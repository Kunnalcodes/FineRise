/**
 * FineRise Database Seeder
 * Run: node import_json.js
 * Seeds: users, products, stores, sales, purchases
 */

const mongoose = require("mongoose");
const fs       = require("fs");

// ── Models ──────────────────────────────────────────────────────────────────
const User     = require("./models/users");
const Product  = require("./models/Product");
const Store    = require("./models/store");
const Sales    = require("./models/sales");
const Purchase = require("./models/purchase");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Finrise";

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✔  Connected to MongoDB →", MONGO_URI.split("/").pop());

        const data = JSON.parse(fs.readFileSync("./seed_data.json", "utf-8"));

        // ── Clear existing collections ────────────────────────────────────
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({}),
            Store.deleteMany({}),
            Sales.deleteMany({}),
            Purchase.deleteMany({}),
        ]);
        console.log("✔  Cleared existing data");

        // ── Convert string IDs to ObjectIds ──────────────────────────────
        const toOid = (id) => new mongoose.Types.ObjectId(id);

        // Users
        const users = data.users.map(u => ({ ...u, _id: toOid(u._id) }));
        await User.insertMany(users);
        console.log(`✔  Inserted ${users.length} users`);

        // Products
        const products = data.products.map(p => ({
            ...p,
            _id: toOid(p._id),
            userID: toOid(p.userID),
        }));
        await Product.insertMany(products);
        console.log(`✔  Inserted ${products.length} products`);

        // Stores
        const stores = data.stores.map(s => ({
            ...s,
            _id: toOid(s._id),
            userID: toOid(s.userID),
        }));
        await Store.insertMany(stores);
        console.log(`✔  Inserted ${stores.length} stores`);

        // Sales
        const sales = data.sales.map(s => ({
            ...s,
            userID:    toOid(s.userID),
            ProductID: toOid(s.ProductID),
            StoreID:   toOid(s.StoreID),
        }));
        await Sales.insertMany(sales);
        console.log(`✔  Inserted ${sales.length} sales`);

        // Purchases
        const purchases = data.purchases.map(p => ({
            ...p,
            userID:    toOid(p.userID),
            ProductID: toOid(p.ProductID),
        }));
        await Purchase.insertMany(purchases);
        console.log(`✔  Inserted ${purchases.length} purchases`);

        console.log("\n🎉  Database successfully seeded with FineRise Intelligence Dataset!");
        process.exit(0);
    } catch (err) {
        console.error("❌  Seeding failed:", err.message);
        process.exit(1);
    }
}

seedDatabase();
