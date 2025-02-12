const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to Database
connectDB();
app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend to access backend
    credentials: true  // Allow sending cookies or authentication headers
}));
// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/horses", require("./routes/horseRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
