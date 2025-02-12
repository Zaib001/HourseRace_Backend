const { ethers } = require("ethers");  // ✅ ethers v5 syntax
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = require("../smart-contract/HorseRegistryABI.json");
const contractAddress = process.env.SMART_CONTRACT_ADDRESS;
const horseRegistryContract = new ethers.Contract(contractAddress, contractABI, wallet);

module.exports = { provider, horseRegistryContract };
