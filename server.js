const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to Database
connectDB();

// ✅ FIX CORS CONFIGURATION
const allowedOrigins = [
    "http://localhost:5173",  // Local frontend (for development)
    "https://hourserace.onrender.com"  // Deployed frontend (Render)
];

app.use(cors({
    origin: allowedOrigins, // ✅ Allows both local and deployed frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true  // ✅ Allows authentication headers (e.g., JWT tokens)
}));

// ✅ Ensure Every Route Has CORS Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/horses", require("./routes/horseRoutes"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
