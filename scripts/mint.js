// Import necessary modules from Hardhat and SwisstronikJS
const { network, web3 } = require("hardhat");
const { abi } = require("../artifacts/contracts/PERC20Sample.sol/PERC20Sample.json");
const { SwisstronikPlugin } = require("@swisstronik/web3-plugin-swisstronik");

async function main() {
    // Register the Swisstronik plugin
    web3.registerPlugin(new SwisstronikPlugin(network.config.url));
    const contractAddress = "0x3D8589Eb557AD1988B512b8B83C89A8E5ff1e0dC";
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi, contractAddress);
    const mint100TokensTx = await contract.methods.mint().send({ from });
    console.log("Transaction hash:", mint100TokensTx.transactionHash);
    console.log("Transaction submitted! Transaction details:", mint100TokensTx);
    console.log(`Transaction completed successfully! ✅  Tokens minted to ${from}`);
    console.log("Transaction hash:", mint100TokensTx.transactionHash);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});