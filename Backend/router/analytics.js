const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Sales = require("../models/sales");
const Product = require("../models/Product");

// GET: Advanced Analytics for Intelligence Hub
router.get("/advanced/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const sales = await Sales.find({ userID: new mongoose.Types.ObjectId(userID) });
    const products = await Product.find({ userID: new mongoose.Types.ObjectId(userID) });

    // 1. Inventory Turnover & DIO
    const turnoverData = products.map(p => {
      const pSales = sales.filter(s => s.ProductID.toString() === p._id.toString());
      const totalSold = pSales.reduce((acc, s) => acc + s.StockSold, 0);
      const avgInventory = (p.stock + (p.stock + totalSold)) / 2;
      const turnover = totalSold / (avgInventory || 1);
      return {
        name: p.name,
        turnover: parseFloat(turnover.toFixed(2)),
        dio: parseFloat((365 / (turnover || 0.1)).toFixed(0))
      };
    });

    // 2. Product Mix Concentration (Revenue dependency)
    const totalRevenue = sales.reduce((acc, s) => acc + s.TotalSaleAmount, 0);
    const productMix = products.map(p => {
      const pSales = sales.filter(s => s.ProductID.toString() === p._id.toString());
      const revenue = pSales.reduce((acc, s) => acc + s.TotalSaleAmount, 0);
      return {
        name: p.name,
        percentage: parseFloat(((revenue / (totalRevenue || 1)) * 100).toFixed(1))
      };
    });

    // 3. Turnover vs. Margin Analysis (Quadrant Matrix)
    const matrix = products.map(p => {
      const pSales = sales.filter(s => s.ProductID.toString() === p._id.toString());
      const revenue = pSales.reduce((acc, s) => acc + s.TotalSaleAmount, 0);
      const sold = pSales.reduce((acc, s) => acc + s.StockSold, 0);
      const turnover = sold / ((p.stock + sold) / 2 || 1);
      // Mocking margin if not available in schema
      const margin = 20 + (Math.random() * 30); 
      return { x: turnover, y: margin, name: p.name };
    });

    res.status(200).json({
      turnover: turnoverData,
      productMix: productMix.sort((a,b) => b.percentage - a.percentage),
      matrix: matrix
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Bestsellers and Revenue Distribution
router.get("/overview/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    // 1. Calculate Bestsellers (Volume)
    const bestsellers = await Sales.aggregate([
      { $match: { userID: new mongoose.Types.ObjectId(userID) } },
      {
        $group: {
          _id: "$ProductID",
          totalSold: { $sum: "$StockSold" },
          totalRevenue: { $sum: "$TotalSaleAmount" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" }
    ]);

    // 2. Format for Charts
    const bestsellerData = {
      labels: bestsellers.map(b => b.productDetails.name),
      values: bestsellers.map(b => b.totalSold)
    };

    const revenueData = {
      labels: bestsellers.map(b => b.productDetails.name),
      values: bestsellers.map(b => b.totalRevenue)
    };

    res.status(200).json({
      bestsellers: bestsellerData,
      revenue: revenueData,
      raw: bestsellers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics aggregation failed" });
  }
});

module.exports = router;
