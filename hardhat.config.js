require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
    solidity: "0.8.28", // Updated to match your contract version
    networks: {
        goerli: {
            url: process.env.ALCHEMY_RPC_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};
