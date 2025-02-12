const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        return res.status(400).json({ error: "Missing Wallet Address or Signature" });
    }

    const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, walletAddress });
};
