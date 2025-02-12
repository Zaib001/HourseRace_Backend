const Horse = require("../models/Horse");
const { horseRegistryContract } = require("../config/alchemy");
const { ethers } = require("ethers");

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



// ✅ Generate a valid ETH address instead of a random one
const generateRandomWalletAddress = () => {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
};

exports.registerHorse = async (req, res) => {
    try {
        const { name, yearOfBirth, dam, sire, sex } = req.body;

        // ✅ Generate a valid Ethereum wallet address for the horse
        const horseWalletAddress = generateRandomWalletAddress();
        console.log(horseWalletAddress)
        // ✅ Generate a valid Ethereum wallet address for the owner (if user is not logged in)
        const ownerWalletAddress = req.user?.walletAddress || generateRandomWalletAddress();

        const newHorse = new Horse({
            name,
            yearOfBirth,
            dam,
            sire,
            sex,
            owner: ownerWalletAddress,
            walletAddress: horseWalletAddress
        });

        await newHorse.save();

        res.json({ message: "Horse registered successfully", horse: newHorse });
    } catch (error) {
        res.status(500).json({ error: "Error registering horse" });
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
