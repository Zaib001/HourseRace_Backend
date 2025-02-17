const mongoose = require("mongoose");

const HorseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    yearOfBirth: { type: Number, required: true },
    dam: { type: String, required: true },
    sire: { type: String, required: true },
    sex: { type: String, required: true },
    owner: { type: String, required: true },
    ownerPrivateKey: { type: String, required: true },  // 🔒 Encrypted private key
    walletAddress: { type: String, required: true },
    walletPrivateKey: { type: String, required: true }, // 🔒 Encrypted private key
    status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Horse", HorseSchema);
