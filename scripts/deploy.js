const hre = require("hardhat");

async function main() {
    const HorseRegistry = await hre.ethers.getContractFactory("HorseRegistry"); 
    const horseRegistry = await HorseRegistry.deploy();

    await horseRegistry.waitForDeployment();
    console.log(`✅ Contract deployed to: ${horseRegistry.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
