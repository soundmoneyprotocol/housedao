# HomeDAO - Fractional Real Estate Social Network

A decentralized platform enabling musicians and creators to invest in real estate through fractional ownership and DAO governance. Built on Solidity with a unified backend integrated with SoundMoney's streaming ecosystem.

## Features

- **Fractional Property Ownership** - Invest in real estate via ERC1155 property shares
- **DAO Governance** - BEZY token holders vote on property decisions
- **Streaming Integration** - Musicians earn streaming yields automatically invested
- **Artist Houses** - Venues with fractional ownership and DAO control
- **Dividend Distribution** - Automated rental income payouts to share holders
- **Secondary Market** - Trade property shares peer-to-peer

## Tech Stack

### Smart Contracts
- Solidity 0.8.10+
- Hardhat for development & testing
- OpenZeppelin contracts (ERC1155, Governor, Timelock)
- Chainlink price feeds for valuation

### Backend
- Node.js + Express
- Supabase (unified with SoundMoney)
- Socket.io for real-time updates
- Bull for job queues (dividend distribution)

### Frontend
- Next.js 14 + React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- ethers.js v5 for Web3

## Project Structure

```
HomeDAO/
├── contracts/              # Smart contracts
│   ├── HomeDAO.sol        # Main property + dividend logic
│   ├── PropertyShare.sol   # ERC1155 token
│   ├── DAOGovernance.sol   # DAO voting
│   └── PriceConverter.sol  # Chainlink integration
├── hardhat/
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.js
├── src/                    # React frontend
│   ├── pages/
│   ├── components/
│   ├── lib/
│   └── styles/
├── supabase/              # Schema migrations
│   └── migrations/
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ and Yarn
- MetaMask or Web3Modal
- Hardhat environment

### Installation

```bash
# Clone repo
git clone https://github.com/yourusername/HomeDAO.git
cd HomeDAO

# Install dependencies
yarn install

# Setup environment
cp .env.example .env.local
# Add RPC_URL, PRIVATE_KEY, SUPABASE_URL, SUPABASE_KEY

# Deploy contracts
cd hardhat
npx hardhat run scripts/deploy.js --network [network-name]

# Start frontend
cd ..
yarn dev
```

## Core Contracts

### HomeDAO.sol
- `addProperty()` - List new investable property
- `investInProperty()` - Buy fractional shares
- `distributeDividends()` - Disperse rental income
- `initiateDAOVote()` - Create governance proposal
- `executeDAODecision()` - Implement voted decision

### PropertyShare.sol (ERC1155)
- Mints fractional ownership tokens
- Tracks cost basis and earnings per share
- Supports dividend claims

### DAOGovernance.sol
- BEZY token weighted voting
- Proposal timelock (2-7 days)
- Vote delegation
- Execution of approved decisions

## Artist Houses

Special properties created by musicians/venues with:
- DAO-controlled management
- Streaming revenue integration (performers' yields auto-invested)
- Event booking + royalty sharing
- Community governance

## Integration with SoundMoney

- **Streaming Earnings**: Musicians' yields → HomeDAO investments
- **BEZY Governance**: Use BEZY tokens to vote on property decisions
- **Unified Auth**: Same SoundMoney account manages everything
- **Real-time Updates**: Socket.io streams property prices, votes, dividends

## Supabase Schema

Additional tables (extends SoundMoney schema):
- `properties` - Property listings, valuation, status
- `property_shares` - Investor holdings, cost basis
- `dao_votes` - Proposals, voting records
- `dividends` - Distribution history
- `artist_houses` - Venue metadata, booking calendar

## License

MIT

---

**Contact:** hello@soundmoney.com | **Docs:** https://homedao.soundmoney.com
