const { ethers } = require("hardhat");
async function main() {
    const perc20 = await ethers.deployContract("PERC20Sample");
    await perc20.waitForDeployment();
    console.log(`PERC20Sample was deployed to ${await perc20.getAddress()}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


