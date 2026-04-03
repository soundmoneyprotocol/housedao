const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Chainlink Price Feed addresses by network
const PRICE_FEEDS = {
  1: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH/USD Mainnet
  11155111: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // ETH/USD Sepolia
  137: "0xF9680D99D6CC9750f3D643DB7D53bd9813b360b4", // ETH/USD Polygon
  80001: "0x0715A7794a1dc8e42615F059dD6e406A6A5eb2c0", // ETH/USD Mumbai
  1444673419: "0x8a53ee33e7b68a7e62eb5f22e6b5481e4b79f8a6", // ETH/USD SKALE Testnet
  324705682: "0x8a53ee33e7b68a7e62eb5f22e6b5481e4b79f8a6", // ETH/USD SKALE Base
};

async function main() {
  console.log("🚀 Deploying HomeDAO contracts to SKALE Base...\n");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
  const networkName = network.name;

  const priceFeed = PRICE_FEEDS[chainId] || "0x8a53ee33e7b68a7e62eb5f22e6b5481e4b79f8a6";

  console.log(`📡 Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`💰 Price Feed: ${priceFeed}`);
  console.log(`📝 Deployer: ${deployer.address}\n`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💵 Account balance: ${ethers.utils.formatEther(balance)} ETH\n`);

  // 1. Deploy PropertyShare token
  console.log("1️⃣  Deploying PropertyShare (ERC1155)...");
  const PropertyShare = await ethers.getContractFactory("PropertyShare");
  const propertyShare = await PropertyShare.deploy();
  await propertyShare.deployed();
  const propertyShareAddress = propertyShare.address;
  console.log(`✅ PropertyShare: ${propertyShareAddress}\n`);

  // 2. Deploy HomeDAO
  console.log("2️⃣  Deploying HomeDAO...");
  const listingFee = ethers.utils.parseEther("0.1"); // 0.1 ETH listing fee
  const HomeDAO = await ethers.getContractFactory("HomeDAO");
  const homeDAO = await HomeDAO.deploy(
    propertyShareAddress,
    listingFee,
    priceFeed
  );
  await homeDAO.deployed();
  const homeDAOAddress = homeDAO.address;
  console.log(`✅ HomeDAO: ${homeDAOAddress}\n`);

  // 3. Set HomeDAO address in PropertyShare
  console.log("3️⃣  Setting HomeDAO contract in PropertyShare...");
  const setDAOTx = await propertyShare.setHomeDAOContract(homeDAOAddress);
  await setDAOTx.wait();
  console.log("✅ PropertyShare initialized\n");

  // 4. Save deployment config
  const config = {
    network: networkName,
    chainId: chainId.toString(),
    timestamp: new Date().toISOString(),
    contracts: {
      PropertyShare: {
        address: propertyShareAddress,
        deployer: deployer.address,
      },
      HomeDAO: {
        address: homeDAOAddress,
        deployer: deployer.address,
        listingFee: ethers.utils.formatEther(listingFee),
      },
    },
    priceFeed,
  };

  // Save to hardhat folder
  const configPath = path.join(__dirname, `../config-${networkName}.json`);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`📋 Config saved: ${configPath}\n`);

  // Summary
  console.log("✨✨✨ Deployment successful! ✨✨✨\n");
  console.log("📊 Contract Addresses:");
  console.log(`   PropertyShare: ${propertyShareAddress}`);
  console.log(`   HomeDAO:       ${homeDAOAddress}`);
  console.log(`\n🔗 Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`⛽ Listing Fee: 0.1 ETH`);
  console.log(`💰 Price Feed: ${priceFeed}`);
  console.log(`\n🎉 HomeDAO is now live on SKALE!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
