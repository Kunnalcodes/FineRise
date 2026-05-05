const mongoose = require("mongoose");

// ─── Use local MongoDB for development ───────────────────────────────────────
// Switch to Atlas by setting MONGO_URI env variable in production
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/Finrise";

function main() {
    return mongoose.connect(uri).then(() => {
        console.log("Database Connection Successful – " + uri.split("@").pop().split("/").pop());
    }).catch((err) => {
        console.log("Error connecting to DB:", err.message);
    });
}

module.exports = { main };