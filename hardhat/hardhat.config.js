require("@nomiclabs/hardhat-ethers");
require("dotenv").config({ path: "../.env.local" });

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const SKALE_RPC_URL = process.env.SKALE_RPC_URL || "https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha";

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // SKALE Base (using the RPC from bezy-tests)
    skaleBaseTestnet: {
      url: SKALE_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 324705682,
      gasPrice: "auto",
    },
    // For actual SKALE testnet (if needed in future)
    skaleTestnet: {
      url: "https://staging-v2.skalenodes.com:10200",
      accounts: [PRIVATE_KEY],
      chainId: 1444673419,
      gasPrice: "auto",
    },
    // Sepolia for comparison
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 1,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: [PRIVATE_KEY],
      chainId: 137,
    },
    polygonMumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
