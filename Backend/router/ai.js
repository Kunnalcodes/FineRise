const express = require("express");
const router = express.Router();
const Sales = require("../models/sales");
const Product = require("../models/Product");
const { SimpleLinearRegression } = require("ml-regression");

// 1. Forecast Sales (AI functionality based on Time-Series / Linear Regression)
router.get("/forecast-sales", async (req, res) => {
  try {
    const sales = await Sales.find().sort({ SaleDate: 1 });
    if (sales.length < 3) {
      return res.status(200).json({
        message: "Not enough data to train the AI model. Need at least 3 sales records.",
        forecast: [],
      });
    }

    // Group sales by date
    const dailySales = {};
    sales.forEach((sale) => {
      const dateStr = new Date(sale.SaleDate).toDateString();
      if (!dailySales[dateStr]) {
        dailySales[dateStr] = 0;
      }
      dailySales[dateStr] += sale.TotalSaleAmount;
    });

    const dates = Object.keys(dailySales).sort((a, b) => new Date(a) - new Date(b));
    const x = []; // Day indices
    const y = []; // Total sale amounts

    dates.forEach((date, index) => {
      x.push(index);
      y.push(dailySales[date]);
    });

    // Train ML Regression Model
    const regression = new SimpleLinearRegression(x, y);

    // Predict for the next 7 days
    const lastDayIndex = x[x.length - 1];
    const forecast = [];
    for (let i = 1; i <= 7; i++) {
      const predictedValue = regression.predict(lastDayIndex + i);
      const nextDate = new Date(dates[dates.length - 1]);
      nextDate.setDate(nextDate.getDate() + i);
      
      forecast.push({
        date: nextDate.toDateString(),
        predictedSales: Math.max(0, predictedValue).toFixed(2), // Cannot have negative sales
      });
    }

    res.status(200).json({
      message: "AI Sales Forecast generated successfully using Linear Regression Model",
      historicalData: dates.map((d, i) => ({ date: d, amount: y[i] })),
      forecast: forecast,
    });
  } catch (error) {
    console.error("AI Forecast Error:", error);
    res.status(500).send(error);
  }
});

// 2. Predict Stock Depletion (AI functionality)
router.get("/predict-stock", async (req, res) => {
  try {
    const products = await Product.find();
    const sales = await Sales.find();
    
    let aiPredictions = [];

    products.forEach((product) => {
      // Find sales for this product
      const productSales = sales.filter(s => s.ProductID.toString() === product._id.toString());
      
      let avgSalesPerDay = 0;
      if (productSales.length > 0) {
        // Sort by date
        productSales.sort((a, b) => new Date(a.SaleDate) - new Date(b.SaleDate));
        
        const firstSale = new Date(productSales[0].SaleDate);
        const lastSale = new Date(productSales[productSales.length - 1].SaleDate);
        
        let diffTime = Math.abs(lastSale - firstSale);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // At least 1 day
        
        const totalSold = productSales.reduce((acc, curr) => acc + curr.StockSold, 0);
        avgSalesPerDay = totalSold / diffDays;
      }

      let daysUntilDepletion = -1; // -1 means no sales data
      if (avgSalesPerDay > 0) {
        daysUntilDepletion = Math.floor(product.stock / avgSalesPerDay);
      }

      aiPredictions.push({
        productName: product.name,
        currentStock: product.stock,
        avgSalesPerDay: avgSalesPerDay.toFixed(2),
        daysUntilDepletion: daysUntilDepletion,
        status: daysUntilDepletion === -1 ? "Insufficient Data" : (daysUntilDepletion < 7 ? "Critical" : "Healthy")
      });
    });

    res.status(200).json(aiPredictions);

  } catch (error) {
    console.error("AI Stock Prediction Error:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
