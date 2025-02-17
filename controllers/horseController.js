const Horse = require("../models/Horse");
const { horseRegistryContract } = require("../config/alchemy");
const { ethers } = require("ethers");
const CryptoJS = require("crypto-js");
const { decryptKey } = require("../utils/crypto");

exports.getHorses = async (req, res) => {
    try {
        const horses = await Horse.find();
        res.json(horses);
    } catch (error) {
        res.status(500).json({ error: "Error fetching horses" });
    }
};

exports.searchHorse = async (req, res) => {
    try {
        const { name } = req.query;
        const horse = await Horse.findOne({ name });
        if (!horse) return res.status(404).json({ error: "Horse not found" });
        res.json(horse);
    } catch (error) {
        res.status(500).json({ error: "Error searching horse" });
    }
};


const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || "3dba8afdc23f4b7f2d35607c08d3d179643b537e14583a42dda4f2cf59f18adc";
const generateWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    const encryptedPrivateKey = CryptoJS.AES.encrypt(wallet.privateKey, ENCRYPTION_SECRET).toString();
    return { address: wallet.address, privateKey: encryptedPrivateKey };
};


exports.registerHorse = async (req, res) => {
    try {
        const { name, yearOfBirth, dam, sire, sex } = req.body;

        // ✅ Generate an Ethereum wallet for the horse
        const horseWallet = generateWallet();

        // ✅ Generate an owner wallet if the user is not logged in
        const ownerWallet = req.user?.walletAddress ? { address: req.user.walletAddress } : generateWallet();

        // ✅ Save horse details with encrypted private key
        const newHorse = new Horse({
            name,
            yearOfBirth,
            dam,
            sire,
            sex,
            owner: ownerWallet.address,
            ownerPrivateKey: ownerWallet.privateKey, // 🔒 Store encrypted private key
            walletAddress: horseWallet.address,
            walletPrivateKey: horseWallet.privateKey // 🔒 Store encrypted private key
        });

        await newHorse.save();

        res.json({ message: "Horse registered successfully", horse: newHorse });
    } catch (error) {
        res.status(500).json({ error: "Error registering horse" });
    }
};
exports.getHorsePrivateKey = async (req, res) => {
    try {
        const { horseName } = req.params;
        const horse = await Horse.findOne({ name: horseName });

        if (!horse) {
            return res.status(404).json({ error: "Horse not found" });
        }

        // ✅ Decrypt private key
        const decryptedPrivateKey = decryptKey(horse.walletPrivateKey);

        res.json({ walletAddress: horse.walletAddress, privateKey: decryptedPrivateKey });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving private key" });
    }
};
exports.approveHorse = async (req, res) => {
    try {
        const { name } = req.body;

        const horse = await Horse.findOne({ name });
        if (!horse) return res.status(404).json({ error: "Horse not found" });

        // Approve Horse on Blockchain
        const tx = await horseRegistryContract.approveHorse(name);
        await tx.wait();

        horse.status = "approved";
        await horse.save();

        res.json({ message: "Horse approved successfully." });
    } catch (error) {
        res.status(500).json({ error: "Error approving horse" });
    }
};

/**
 * ✅ New API: Get Horses Registered by a Specific User
 * - Fetches all horses associated with the logged-in user
 */
exports.getUserHorses = async (req, res) => {
    try {
        const owner = req.user.walletAddress;
        const horses = await Horse.find({ owner });

        if (!horses.length) {
            return res.status(404).json({ error: "No horses found for this user." });
        }

        res.json({ horses });
    } catch (error) {
        res.status(500).json({ error: "Error fetching user's horses" });
    }
};
