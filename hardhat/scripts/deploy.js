const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Chainlink Price Feed addresses by network
const PRICE_FEEDS = {
  1: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH/USD Mainnet
  11155111: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // ETH/USD Sepolia
  137: "0xF9680D99D6CC9750f3D643DB7D53bd9813b360b4", // ETH/USD Polygon
  80001: "0x0715A7794a1dc8e42615F059dD6e406A6A5eb2c0", // ETH/USD Mumbai
  1444673419: "0xF9680D99D6CC9750f3D643DB7D53bd9813b360b4", // ETH/USD SKALE Testnet
  324705682: "0xF9680D99D6CC9750f3D643DB7D53bd9813b360b4", // ETH/USD SKALE Base
};

async function main() {
  console.log("🚀 Deploying HomeDAO contracts...");

  const network = hre.network.name;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  const priceFeed = PRICE_FEEDS[chainId] || PRICE_FEEDS[11155111];

  console.log(`\n📡 Network: ${network} (Chain ID: ${chainId})`);
  console.log(`💰 Price Feed: ${priceFeed}`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploying with account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`💵 Account balance: ${hre.ethers.utils.formatEther(balance)} ETH\n`);

  // 1. Deploy PropertyShare token
  console.log("1️⃣  Deploying PropertyShare (ERC1155)...");
  const PropertyShare = await hre.ethers.getContractFactory("PropertyShare");
  const propertyShare = await PropertyShare.deploy();
  await propertyShare.deployed();
  console.log(`✅ PropertyShare deployed to: ${propertyShare.address}`);

  // 2. Deploy HomeDAO
  console.log("\n2️⃣  Deploying HomeDAO...");
  const listingFee = hre.ethers.utils.parseEther("0.1"); // 0.1 ETH listing fee
  const HomeDAO = await hre.ethers.getContractFactory("HomeDAO");
  const homeDAO = await HomeDAO.deploy(
    propertyShare.address,
    listingFee,
    priceFeed
  );
  await homeDAO.deployed();
  console.log(`✅ HomeDAO deployed to: ${homeDAO.address}`);

  // 3. Set HomeDAO address in PropertyShare
  console.log("\n3️⃣  Setting HomeDAO contract in PropertyShare...");
  const setDAOTx = await propertyShare.setHomeDAOContract(homeDAO.address);
  await setDAOTx.wait();
  console.log("✅ PropertyShare updated with HomeDAO address");

  // 4. Save contract config
  const config = {
    network,
    chainId,
    contracts: {
      PropertyShare: {
        address: propertyShare.address,
        abi: getABI(PropertyShare),
      },
      HomeDAO: {
        address: homeDAO.address,
        abi: getABI(HomeDAO),
      },
    },
    deployment: {
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      listingFee: listingFee.toString(),
      priceFeed,
    },
  };

  const configPath = path.join(__dirname, `../config-${network}.json`);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`\n📋 Config saved to: ${configPath}`);

  // Also save to frontend src folder
  const srcConfigPath = path.join(__dirname, `../../src/contracts/config-${network}.json`);
  const srcDir = path.dirname(srcConfigPath);
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  fs.writeFileSync(srcConfigPath, JSON.stringify(config, null, 2));
  console.log(`📋 Frontend config saved to: ${srcConfigPath}`);

  console.log("\n✨ Deployment completed successfully!");
  console.log("\n📊 Deployment Summary:");
  console.log(`   PropertyShare: ${propertyShare.address}`);
  console.log(`   HomeDAO: ${homeDAO.address}`);
  console.log(`   Network: ${network} (${chainId})`);

  // Verification instructions
  console.log("\n🔍 To verify contracts on Etherscan:");
  console.log(`   npx hardhat verify --network ${network} ${propertyShare.address}`);
  console.log(`   npx hardhat verify --network ${network} ${homeDAO.address} ${propertyShare.address} ${listingFee} ${priceFeed}`);
}

function getABI(contractFactory) {
  const artifact = require(path.join(
    __dirname,
    `../artifacts/contracts/${contractFactory.contractName}.sol/${contractFactory.contractName}.json`
  ));
  return artifact.abi;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
