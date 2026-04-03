# HomeDAO Quick Start Guide

Get HomeDAO running locally in 5 minutes.

## Prerequisites

- Node.js 18+
- Git
- MetaMask or another Web3 wallet
- Sepolia testnet ETH (from [faucet](https://sepoliafaucet.com))

## 1. Clone & Install

```bash
cd /Users/casmirpatterson/soundmoney/HomeDAO
yarn install
```

## 2. Setup Environment

```bash
cp .env.example .env.local
```

Fill in these values:
```env
PRIVATE_KEY=your_wallet_private_key
INFURA_API_KEY=your_infura_key (from https://infura.io)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
```

## 3. Deploy Contracts (Local)

```bash
cd hardhat
npx hardhat run scripts/deploy.js --network sepolia
```

This outputs:
- PropertyShare contract address
- HomeDAO contract address
- Contract config file

## 4. Update Config

Edit `.env.local` and add the contract addresses from deployment:
```env
NEXT_PUBLIC_HOMEDAO_ADDRESS=0x...
NEXT_PUBLIC_PROPERTY_SHARE_ADDRESS=0x...
```

## 5. Start Frontend

```bash
yarn dev
```

Open http://localhost:3000/homedao/invest

## First Time User Flow

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Switch to Sepolia network

2. **Browse Properties**
   - View available properties
   - Filter by city, ROI, artist houses
   - Click property to see full details

3. **Invest in Property**
   - Click "Invest" on any property
   - Set number of shares
   - Approve transaction in MetaMask
   - See investment appear in portfolio

4. **View DAO Proposals**
   - Go to property detail page
   - Click "DAO Votes" tab
   - Create proposal or vote on existing

5. **Check Dividends**
   - Go to property detail page
   - Click "Dividends" tab
   - Claim available dividends

## File Structure Quick Reference

```
HomeDAO/
├── contracts/                # Smart contracts (Solidity)
├── hardhat/
│   ├── contracts/           # Contract sources
│   ├── scripts/
│   │   └── deploy.js        # Deployment script
│   └── hardhat.config.js    # Network configuration
├── src/
│   ├── app/
│   │   ├── invest/          # Main investment page
│   │   └── property/[id]/   # Property detail page
│   ├── api/homedao/         # API routes
│   └── components/          # React components
├── supabase/
│   └── schema.sql           # Database schema
├── README.md                # Full documentation
├── DEPLOYMENT.md            # Production deployment
├── INTEGRATION.md           # SoundMoney integration
└── QUICKSTART.md            # This file
```

## Common Commands

```bash
# Development
yarn dev                    # Start dev server

# Smart Contracts
yarn hardhat:compile       # Compile contracts
yarn hardhat:test          # Run tests
yarn hardhat:deploy        # Deploy to testnet

# Database
yarn supabase:migrate      # Apply migrations

# Production
yarn build                 # Build for production
yarn start                 # Start production server
```

## Useful Links

- **Sepolia Faucet**: https://sepoliafaucet.com
- **Sepolia Block Explorer**: https://sepolia.etherscan.io
- **Supabase Dashboard**: https://app.supabase.com
- **Infura Dashboard**: https://infura.io
- **MetaMask**: https://metamask.io

## Troubleshooting

**"Network not found" error**
- Check hardhat.config.js has correct network
- Make sure .env file has RPC_URL

**"Contract not found" error**
- Re-run deployment script
- Check contract addresses in .env.local

**"Insufficient balance" error**
- Get testnet ETH from Sepolia faucet
- Wait for transaction to confirm

**"MetaMask not detecting network"**
- Manually add Sepolia:
  - Network: Sepolia Testnet
  - RPC: https://sepolia.infura.io/v3/YOUR_KEY
  - Chain ID: 11155111
  - Currency: ETH

## Next Steps

1. ✅ Deploy contracts (you just did this)
2. ✅ Run frontend locally (you just did this)
3. 📍 Explore the Invest page
4. 📍 Create and list a property
5. 📍 Invest in a property
6. 📍 Create a DAO proposal
7. 📍 Deploy to production (see DEPLOYMENT.md)

## Support

- **Docs**: See README.md and INTEGRATION.md
- **Issues**: Check GitHub issues
- **Discord**: Join SoundMoney Discord for support

---

**Ready to build?** Start investing in real estate on the blockchain! 🏠🚀
