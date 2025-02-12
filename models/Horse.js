const mongoose = require("mongoose");

const HorseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    yearOfBirth: { type: Number, required: true },
    dam: { type: String, required: true },
    sire: { type: String, required: true },
    sex: { type: String, required: true },
    owner: { type: String, required: true }, // Ethereum address
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    walletAddress: { type: String, required: true } // Unique 0x Address
});

module.exports = mongoose.model("Horse", HorseSchema);
