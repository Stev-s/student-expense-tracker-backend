const mysql = require("mysql2");
require("dotenv").config();

// Create a POOL instead of a single connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000, 
    // ✅ Keep SSL, but ensure Railway's environment variable is used
    ssl: {
        rejectUnauthorized: false 
    },
    // ✅ Add these pool settings to keep the connection alive
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// ✅ Handle the connection errors properly so it doesn't crash the app
db.getConnection((err, connection) => {
    if (err) {
        console.log("❌ Database connection failed:", err.code, err.message);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log("Database connection was closed. The pool will reconnect automatically.");
        }
    } else {
        console.log("✅ Connected to MySQL Database");
        // Always release the connection back to the pool when done testing
        connection.release(); 
    }
});

module.exports = db;