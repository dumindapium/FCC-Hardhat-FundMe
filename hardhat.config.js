require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require('solidity-coverage');
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("hardhat-gas-reporter");

const ALCHEMY_GOERLI_RPC_URL = process.env.ALCHEMY_GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: {
    compilers: [
      { version: "0.6.6" },
      { version: "0.8.17" }
    ]
  },
  mocha: {
    timeout: 100000000
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    goerli: {
      url: ALCHEMY_GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5, //5 for Goerli
      blockConfirmations: 6
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
};
