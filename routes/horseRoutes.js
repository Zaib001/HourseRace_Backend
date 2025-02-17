const express = require("express");
const { registerHorse, getHorses, searchHorse, approveHorse, getUserHorses,getHorsePrivateKey } = require("../controllers/horseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Register a horse (No need to connect wallet beforehand)
router.post("/", registerHorse);

// ✅ Get all registered horses
router.get("/", getHorses);

// ✅ Search for a horse by name
router.get("/search", searchHorse);

// ✅ Get all horses registered by a specific user (requires authentication)
router.get("/user", authMiddleware, getUserHorses);

// ✅ Approve a horse (Admin Only)
router.post("/approve", approveHorse);

router.get("/private-key/:horseName", getHorsePrivateKey);
module.exports = router;
