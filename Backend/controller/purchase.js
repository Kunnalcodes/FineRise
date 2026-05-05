const Purchase = require("../models/purchase");
const purchaseStock = require("./purchaseStock");

// Add Purchase Details
const addPurchase = (req, res) => {
  const addPurchaseDetails = new Purchase({
    userID: req.body.userID,
    ProductID: req.body.productID,
    QuantityPurchased: req.body.quantityPurchased,
    PurchaseDate: req.body.purchaseDate,
    TotalPurchaseAmount: req.body.totalPurchaseAmount,
  });

  addPurchaseDetails
    .save()
    .then((result) => {
      purchaseStock(req.body.productID, req.body.quantityPurchased);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  const findAllPurchaseData = await Purchase.find({"userID": req.params.userID})
    .sort({ _id: -1 })
    .populate("ProductID"); // -1 for descending order
  res.json(findAllPurchaseData);
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  let totalPurchaseAmount = 0;
  const purchaseData = await Purchase.find({"userID": req.params.userID});
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  });
  res.json({ totalPurchaseAmount });
};

// Delete Purchase
const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).send("Purchase not found");

    // Revert stock
    await purchaseStock(purchase.ProductID, -purchase.QuantityPurchased);

    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase deleted and stock reverted" });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount, deletePurchase };
