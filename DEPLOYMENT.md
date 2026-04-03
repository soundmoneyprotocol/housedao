# HomeDAO Deployment Guide

Complete guide to deploying HomeDAO smart contracts and frontend across multiple networks.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Contract Deployment](#contract-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Supabase Schema Migration](#supabase-schema-migration)
5. [Streaming Integration Setup](#streaming-integration-setup)
6. [Testing & Verification](#testing--verification)

---

## Prerequisites

### Required Tools
- Node.js 18+
- Yarn or npm
- Hardhat (`npm install -g hardhat`)
- Supabase CLI (`npm install -g @supabase/cli`)

### Required Accounts
- **Infura** - https://infura.io (for RPC endpoints)
- **Etherscan** - https://etherscan.io (for contract verification)
- **Supabase** - https://supabase.com (shared with SoundMoney)
- **MetaMask** or other Web3 wallet with testnet funds

### Network Setup

Install Hardhat dependencies:
```bash
cd hardhat
npm install
```

Create `.env` file in project root:
```bash
cp .env.example .env
```

Fill in your credentials:
```env
PRIVATE_KEY=your_wallet_private_key
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

---

## Contract Deployment

### 1. Deploy to Sepolia Testnet (Recommended for Testing)

```bash
cd hardhat
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:
```
✅ PropertyShare deployed to: 0x...
✅ HomeDAO deployed to: 0x...
📋 Config saved to: ./config-sepolia.json
```

### 2. Deploy to Polygon Mumbai (Multi-chain Testing)

```bash
cd hardhat
npx hardhat run scripts/deploy.js --network polygonMumbai
```

### 3. Deploy to SKALE Base Testnet

```bash
cd hardhat
npx hardhat run scripts/deploy.js --network skaleTestnet
```

### 4. Deploy to Production

**Mainnet Deployment** (Ethereum):
```bash
cd hardhat
npx hardhat run scripts/deploy.js --network mainnet
```

**Polygon Mainnet**:
```bash
cd hardhat
npx hardhat run scripts/deploy.js --network polygon
```

**SKALE Base Mainnet**:
```bash
cd hardhat
npx hardhat run scripts/deploy.js --network skaleBase
```

### Contract Verification

After deployment, verify contracts on block explorers:

```bash
# Sepolia
npx hardhat verify --network sepolia PROPERTY_SHARE_ADDRESS
npx hardhat verify --network sepolia HOMEDAO_ADDRESS PROPERTY_SHARE_ADDRESS LISTING_FEE PRICE_FEED

# Polygon
npx hardhat verify --network polygon PROPERTY_SHARE_ADDRESS
npx hardhat verify --network polygon HOMEDAO_ADDRESS PROPERTY_SHARE_ADDRESS LISTING_FEE PRICE_FEED
```

---

## Frontend Deployment

### 1. Local Development

```bash
# Install dependencies
yarn install

# Create .env.local
cp .env.example .env.local

# Add contract addresses from deployment
# Update NEXT_PUBLIC_CONTRACT_ADDRESSES in .env.local

# Start dev server
yarn dev
```

Visit http://localhost:3000/homedao/invest

### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_KEY
# - NEXT_PUBLIC_CONTRACT_ADDRESSES
```

### 3. Self-Hosted Deployment

```bash
# Build
yarn build

# Start production server
yarn start

# Or use PM2 for process management
pm2 start yarn --name homedao -- start
```

---

## Supabase Schema Migration

### 1. Create Migration File

```bash
supabase migration new add_homedao_schema
```

### 2. Add Schema from supabase/schema.sql

Copy the contents of `supabase/schema.sql` into the migration file.

### 3. Apply Migration

```bash
# Local development
supabase db push

# Staging/Production
supabase db push --linked
```

### 4. Verify Tables Created

```bash
supabase db list
```

Should see:
- `properties`
- `property_shares`
- `dao_proposals`
- `dao_votes`
- `dividends`
- `artist_houses`
- `streaming_investment_allocations`

---

## Streaming Integration Setup

### 1. Link SoundMoney Backend

Update in SoundMoney's unified backend (`api.soundmoneyprotocol.xyz`):

```typescript
// Add to streaming earnings service
async function allocateStreamingEarnings(userId: string) {
  // Get user's HomeDAO investment allocations
  const allocations = await supabase
    .from('streaming_investment_allocations')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true);

  // For each allocation, calculate shares to invest
  for (const allocation of allocations.data) {
    const investAmount = totalEarnings * (allocation.allocation_percentage / 100);
    
    // Call HomeDAO.investInProperty() with calculated ETH amount
    await investInProperty(allocation.property_id, investAmount);
  }
}
```

### 2. Create Streaming Investment Route

Add API endpoint in SoundMoney backend:

```typescript
// POST /api/streaming/allocations
// Allow users to allocate % of streaming earnings to HomeDAO properties
```

### 3. Link Artist House Events

Update `/shows` page to show Artist House hosting opportunities:

```typescript
// Fetch artist houses from HomeDAO
const artistHouses = await supabase
  .from('artist_houses')
  .select('*')
  .eq('event_booking_enabled', true);

// Show available Artist House venues for booking
```

---

## Testing & Verification

### 1. Run Contract Tests

```bash
cd hardhat
npx hardhat test
```

### 2. Integration Testing

Test smart contract flows:
```bash
# List property
npx hardhat run scripts/test-list-property.js --network sepolia

# Invest in property
npx hardhat run scripts/test-invest.js --network sepolia

# Distribute dividends
npx hardhat run scripts/test-dividends.js --network sepolia

# Create DAO vote
npx hardhat run scripts/test-dao-vote.js --network sepolia
```

### 3. Frontend QA

Test critical user flows:

1. **Investment Flow**
   - [ ] Browse properties on `/homedao/invest`
   - [ ] Filter by city, ROI, artist houses
   - [ ] View property details
   - [ ] Connect wallet
   - [ ] Invest in property
   - [ ] See investment in portfolio

2. **DAO Voting**
   - [ ] Navigate to property detail page
   - [ ] View active DAO proposals
   - [ ] Cast vote on proposal
   - [ ] See voting results update

3. **Dividends**
   - [ ] View dividend history
   - [ ] Claim available dividends
   - [ ] See updated balance

4. **Cap Table**
   - [ ] View all shareholders
   - [ ] See ownership percentages
   - [ ] Verify dividend calculations

### 4. Load Testing

For production deployments, simulate concurrent users:

```bash
# Using Artillery
npm install -g artillery

artillery quick --count 100 --num 10 http://yourdomain.com/homedao/invest
```

---

## Post-Deployment Checklist

### Smart Contracts
- [ ] Contracts deployed to all target networks
- [ ] Contracts verified on block explorers
- [ ] Configuration files generated and backed up
- [ ] Admin functions tested and accessible
- [ ] Price feed working correctly

### Frontend
- [ ] Build successful with 0 TypeScript errors
- [ ] All pages accessible and responsive
- [ ] Web3 wallet connections working
- [ ] Form submissions working
- [ ] API endpoints responding

### Supabase
- [ ] All tables created with correct schemas
- [ ] RLS policies enabled and tested
- [ ] Indexes created for performance
- [ ] Backups configured

### Monitoring
- [ ] Error logging (Sentry) configured
- [ ] Analytics tracking active
- [ ] Health checks in place
- [ ] Alerting configured for critical errors

### Documentation
- [ ] Deployment guide updated
- [ ] API documentation complete
- [ ] User onboarding guide prepared
- [ ] Support runbook created

---

## Troubleshooting

### Contract Deployment Issues

**Error: "Insufficient funds"**
- Ensure wallet has enough testnet ETH
- Request faucet funds: https://sepoliafaucet.com

**Error: "Invalid price feed"**
- Verify price feed address for the network
- Check PRICE_FEEDS mapping in deploy.js

**Error: "Contract already exists at address"**
- Deploy script is idempotent; remove old config file and redeploy

### Frontend Issues

**Error: "Contract not found"**
- Ensure .env.local has correct contract addresses
- Run deployment script to update config

**Error: "Supabase connection failed"**
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Check service key has admin privileges

**Error: "Wallet connection failed"**
- Ensure user is on correct network
- Check Web3Modal configuration

### Database Issues

**Error: "Table does not exist"**
- Re-run Supabase migration: `supabase db push`
- Check migration status: `supabase migration list`

---

## Support & Resources

- **Hardhat Docs**: https://hardhat.org/getting-started
- **Solidity Docs**: https://docs.soliditylang.org/
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **ethers.js Docs**: https://docs.ethers.io/v5/

---

**Last Updated**: 2026-04-02
**Status**: Production Ready
