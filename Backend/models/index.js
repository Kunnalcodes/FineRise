const mongoose = require("mongoose");

// ─── Use local MongoDB for development ───────────────────────────────────────
// Use MONGODB_URI or MONGO_URI from environment variables (important for Render/Heroku)
// Fallback to local MongoDB if neither is set
const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Finrise";

function main() {
    return mongoose.connect(uri)
        .then(() => {
            console.log("✅ Database Connection Successful");
        })
        .catch((err) => {
            console.error("❌ Database Connection Error!");
            console.error("Path attempted:", uri);
            console.error("Error Detail:", err.message);
            if (uri.includes("127.0.0.1")) {
                console.error("TIP: Your local MongoDB server doesn't seem to be running. Start it or provide a cloud URI (like MongoDB Atlas) via MONGO_URI env var.");
            }
        });
}

module.exports = { main };