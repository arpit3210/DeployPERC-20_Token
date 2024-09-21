# PERC-20 Token Minting on Swisstronik Blockchain

This project demonstrates how to mint a PERC-20 token using Hardhat and deploy it on the Swisstronik blockchain. PERC-20 tokens offer enhanced privacy features compared to standard tokens, making them ideal for sensitive or private networks.

## Prerequisites

- Visual Studio Code or any preferred code editor
- Node.js and npm
- MetaMask wallet

## Setup

1. Create a new project directory:
   ```
   mkdir DeployPERC-20_Token
   cd DeployPERC-20_Token
   ```

2. Install Hardhat:
   ```
   npm install --save-dev hardhat
   ```

3. Initialize a new Hardhat project:
   ```
   npx hardhat init
   ```

4. Set up your private key as an environment variable:
   ```
   npx hardhat vars set PRIVATE_KEY
   ```

5. Configure the Swisstronik network in `hardhat.config.js`:

   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("@nomicfoundation/hardhat-web3-v4");

   const PRIVATE_KEY = vars.get("PRIVATE_KEY");

   module.exports = {
     defaultNetwork: "swisstronik",
     solidity: "0.8.20",
     networks: {
       swisstronik: {
         url: "https://json-rpc.testnet.swisstronik.com/",
         accounts: [`0x` + `${PRIVATE_KEY}`],
       },
     },
   };
   ```

6. Install required dependencies:
   ```
   npm install @nomicfoundation/hardhat-web3-v4 web3-utils @openzeppelin/contracts @swisstronik/web3-plugin-swisstronik web3 --save-dev
   ```

## Smart Contract
Please copy all smart contract from contracts folder.

First run this command or create files manually

command for powershell if you use command prompt, Please create file manually in contract folder.
```
cd  contracts

"IPERC20.sol", "IPERC20Metadata.sol", "PERC20.sol", "PERC20Sample.sol" | ForEach-Object { New-Item -Name $_ -ItemType File }
```


The main smart contract is `PERC20Sample.sol`. Here's the content:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PERC20.sol";

contract PERC20Sample is PERC20 {
    constructor() PERC20("Sample PERC20", "pSWTR") {}

    receive() external payable {
        _mint(_msgSender(), msg.value);
    }

    function balanceOf(address account) public view override returns (uint256) {
        require(msg.sender == account, "PERC20Sample: msg.sender != account");
        return _balances[account];
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        require(msg.sender == spender, "PERC20Sample: msg.sender != account");
        return _allowances[owner][spender];
    }

    function mint() public {
        _mint(msg.sender, 100*10**18);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
}
```

## Deployment

1. Create a deployment script `deploy.js` in the `scripts` folder:

```javascript
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
```

2. Run the deployment script:
   ```
   npx hardhat run scripts/deploy.js --network swisstronik
   ```

## Minting Tokens

1. Create a minting script `mint.js` in the `scripts` folder:

```javascript
const { network, web3 } = require("hardhat");
const { abi } = require("../artifacts/contracts/PERC20Sample.sol/PERC20Sample.json");
const { SwisstronikPlugin } = require("@swisstronik/web3-plugin-swisstronik");

async function main() {
    web3.registerPlugin(new SwisstronikPlugin(network.config.url));
    const contractAddress = "YOUR_CONTRACT_ADDRESS";
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
```

2. Run the minting script:
   ```
   npx hardhat run scripts/mint.js --network swisstronik
   ```

## Transferring Tokens

1. Create a transfer script `transfer.js` in the `scripts` folder:

```javascript
const { network, web3 } = require("hardhat");
const { abi } = require("../artifacts/contracts/PERC20Sample.sol/PERC20Sample.json");
const { SwisstronikPlugin } = require("@swisstronik/web3-plugin-swisstronik");

async function main() {
    web3.registerPlugin(new SwisstronikPlugin(network.config.url));
    const contractAddress = "YOUR_CONTRACT_ADDRESS";
    const recipient_wallet_address = "RECIPIENT_WALLET_ADDRESS";
    const send_amount = 1 * 10 ** 18;
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi, contractAddress);
    const transfer_TokensTx = await contract.methods.transfer(recipient_wallet_address, send_amount).send({ from });
    console.log("Transaction hash:", transfer_TokensTx.transactionHash);
    console.log("Transaction submitted! Transaction details:", transfer_TokensTx);
    console.log(`Transaction completed successfully! ✅  Token transferred to ${recipient_wallet_address}`);
    console.log("Transaction hash:", transfer_TokensTx.transactionHash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

2. Run the transfer script:
   ```
   npx hardhat run scripts/transfer.js --network swisstronik
   ```

## Verifying Transactions

Use the [Swisstronik Testnet Explorer](https://explorer-evm.testnet.swisstronik.com/) to verify your transactions.

## Privacy Features of PERC-20 Tokens

- Disabled public balance checks and allowances
- Customizable access control logic
- Optional disabling of transfer and approval events for enhanced privacy

## Contributing

Feel free to fork this repository and submit pull requests for any improvements or additional features.

## License

This project is licensed under the MIT License.