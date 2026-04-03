# HomeDAO Integration with SoundMoney

Complete guide to integrating HomeDAO with SoundMoney's streaming ecosystem, unified backend, and BEZY token governance.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Streaming Earnings Integration](#streaming-earnings-integration)
3. [Artist Houses & Venues](#artist-houses--venues)
4. [BEZY Token Governance](#bezy-token-governance)
5. [Unified Backend API](#unified-backend-api)
6. [User Portfolio Integration](#user-portfolio-integration)

---

## Architecture Overview

### Unified Backend Structure

```
soundmoneyprotocol.xyz (unified backend)
├── /api/streaming/
│   ├── /earnings          ← Real-time streaming earnings
│   ├── /bzy               ← BZY token tracking
│   └── /sessions          ← Active streams
├── /api/homedao/
│   ├── /properties        ← List & invest
│   ├── /dividends         ← Distribute earnings
│   ├── /dao-votes         ← DAO governance
│   └── /artist-houses     ← Venue management
└── /api/portfolio/
    ├── /earnings          ← Combined earnings dashboard
    └── /investments       ← All holdings (streaming, real estate, etc)
```

### Data Flow

```
1. Musician Streams
   ↓
2. Earns BZY tokens + ETH streaming yields
   ↓
3. User allocates % to HomeDAO investments
   ↓
4. Auto-invest function calls HomeDAO.investInProperty()
   ↓
5. Receive fractional property shares (ERC1155)
   ↓
6. Earn dividends from rental income
   ↓
7. Use BEZY tokens to vote on property decisions
   ↓
8. View combined portfolio (streaming + real estate)
```

---

## Streaming Earnings Integration

### 1. Update Streaming Earnings Service

File: `api.soundmoneyprotocol.xyz/services/streaming/earnings.ts`

```typescript
import { supabase } from '@/lib/supabase';
import { homeDAO } from '@/lib/contracts/HomeDAO';

interface StreamingEarnings {
  userId: string;
  ethEarned: bigint;
  bezyEarned: bigint;
  session: StreamingSession;
}

/**
 * Process streaming earnings and allocate to HomeDAO investments
 */
export async function processStreamingEarnings(earnings: StreamingEarnings) {
  // 1. Get user's active HomeDAO allocations
  const { data: allocations } = await supabase
    .from('streaming_investment_allocations')
    .select('*')
    .eq('user_id', earnings.userId)
    .eq('active', true);

  if (!allocations || allocations.length === 0) {
    // No allocations, just deposit to account
    return;
  }

  // 2. For each allocation, invest a portion of earnings
  for (const allocation of allocations) {
    const investmentAmount = earnings.ethEarned * 
      (allocation.allocation_percentage / 100);

    try {
      // 3. Call HomeDAO contract to invest
      const tx = await homeDAO.investInProperty(
        allocation.property_id,
        investmentAmount,
        {
          from: earnings.userId,
          value: investmentAmount,
        }
      );

      // 4. Record investment in database
      await supabase
        .from('streaming_investment_allocations')
        .update({
          earnings_invested: allocation.earnings_invested + investmentAmount,
        })
        .eq('id', allocation.id);

      // 5. Emit event for real-time updates
      emitEvent('investment-recorded', {
        userId: earnings.userId,
        propertyId: allocation.property_id,
        amount: investmentAmount,
      });

    } catch (error) {
      console.error(`Failed to invest for user ${earnings.userId}:`, error);
      // Log failure but don't stop other allocations
      await logInvestmentFailure(earnings.userId, allocation.id, error);
    }
  }
}
```

### 2. Create Investment Allocation API

File: `api.soundmoneyprotocol.xyz/homedao/allocations`

```typescript
// POST /api/homedao/allocations
// Create or update streaming earnings allocation
router.post('/allocations', authenticate, async (req, res) => {
  const { propertyId, allocationPercentage } = req.body;
  const userId = req.user.id;

  // Validate allocation percentage
  if (allocationPercentage < 0 || allocationPercentage > 100) {
    return res.status(400).json({ error: 'Invalid percentage' });
  }

  // Check if allocation already exists
  const { data: existing } = await supabase
    .from('streaming_investment_allocations')
    .select('*')
    .eq('user_id', userId)
    .eq('property_id', propertyId);

  if (existing?.length > 0) {
    // Update existing
    const { data } = await supabase
      .from('streaming_investment_allocations')
      .update({ allocation_percentage: allocationPercentage })
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .select()
      .single();

    return res.json(data);
  } else {
    // Create new
    const { data } = await supabase
      .from('streaming_investment_allocations')
      .insert({
        user_id: userId,
        property_id: propertyId,
        allocation_percentage: allocationPercentage,
        active: true,
      })
      .select()
      .single();

    return res.json(data);
  }
});

// GET /api/homedao/allocations
// Get user's investment allocations
router.get('/allocations', authenticate, async (req, res) => {
  const { data } = await supabase
    .from('streaming_investment_allocations')
    .select(`
      *,
      properties (
        name,
        city,
        annual_yield_percentage,
        valuation_usd
      )
    `)
    .eq('user_id', req.user.id)
    .eq('active', true);

  res.json(data);
});
```

### 3. Add Allocation Widget to Streaming Dashboard

File: `soundmoneymusic-main/src/app/earnings/page.tsx`

```typescript
import { StreamingAllocationWidget } from '@/components/HomeDAO/StreamingAllocationWidget';

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      {/* Existing earnings display */}
      <EarningsCounter />

      {/* NEW: HomeDAO Allocation */}
      <StreamingAllocationWidget />

      {/* Other sections */}
    </div>
  );
}
```

---

## Artist Houses & Venues

### 1. Artist House Schema Extension

Table: `artist_houses`

```sql
CREATE TABLE artist_houses (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  artist_id UUID REFERENCES auth.users(id),
  venue_name VARCHAR(255),
  event_capacity INT,
  has_streaming_integration BOOLEAN DEFAULT true,
  streaming_earnings_split INT DEFAULT 8000, -- 80/20 artists/venue
  event_booking_enabled BOOLEAN,
  royalty_percentage INT, -- 5% default (500 bps)
  metadata JSONB
);
```

### 2. Create Artist House Venue Page

File: `soundmoneymusic-main/src/app/venues/[venueId]/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import { EventCalendar } from '@/components/venues/EventCalendar';
import { RevenueShare } from '@/components/venues/RevenueShare';
import { OwnershipStructure } from '@/components/venues/OwnershipStructure';

export default function VenuePage() {
  const { venueId } = useParams();
  const { data: venue } = useFetch(`/api/homedao/artist-houses/${venueId}`);
  const { data: property } = useFetch(`/api/homedao/properties/${venue?.property_id}`);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Venue Hero */}
      <VenueHero venue={venue} />

      {/* Event Booking Calendar */}
      <EventCalendar venueId={venueId} />

      {/* Revenue Share Model */}
      {venue?.has_streaming_integration && (
        <RevenueShare 
          artistPercentage={venue.streaming_earnings_split / 100}
          venuePercentage={(10000 - venue.streaming_earnings_split) / 100}
        />
      )}

      {/* Cap Table (who owns this venue) */}
      <OwnershipStructure property={property} />
    </div>
  );
}
```

### 3. Artist House Booking Integration

File: `api.soundmoneyprotocol.xyz/homedao/artist-houses/bookings`

```typescript
// POST /api/homedao/artist-houses/:venueId/bookings
// Book event at Artist House
router.post('/:venueId/bookings', authenticate, async (req, res) => {
  const { performerId, eventDate, eventName, expectedAttendees } = req.body;
  const venueId = req.params.venueId;

  // Create booking record
  const { data: booking } = await supabase
    .from('artist_house_bookings')
    .insert({
      venue_id: venueId,
      performer_id: performerId,
      event_date: eventDate,
      event_name: eventName,
      expected_attendees: expectedAttendees,
      status: 'pending',
    })
    .select()
    .single();

  // Generate smart contract for revenue split
  const { data: contract } = await supabase
    .from('revenue_contracts')
    .insert({
      booking_id: booking.id,
      artist_id: performerId,
      venue_id: venueId,
      split_percentage: venue.streaming_earnings_split,
      royalty_percentage: venue.royalty_percentage,
    })
    .select()
    .single();

  return res.json({ booking, contract });
});
```

---

## BEZY Token Governance

### 1. DAO Vote with BEZY Tokens

File: `HomeDAO.sol` - Updated voting logic

```solidity
// Add BEZY token interface
interface IBEZYToken {
  function balanceOf(address account) external view returns (uint256);
  function delegatedVotes(address account) external view returns (uint256);
}

contract HomeDAO {
  IBEZYToken public bezyToken;

  /**
   * Cast DAO vote with BEZY token weight
   */
  function castDAOVote(
    uint256 _proposalId,
    bool _support
  ) external {
    // Get voter's BEZY balance as voting power
    uint256 votingPower = bezyToken.delegatedVotes(msg.sender);
    require(votingPower > 0, "No BEZY tokens to vote");

    // Record vote
    DAOProposal storage proposal = daoProposals[_proposalId];
    if (_support) {
      proposal.forVotes += votingPower;
    } else {
      proposal.againstVotes += votingPower;
    }

    hasVotedOnProposal[_proposalId][msg.sender] = true;

    emit DAOVoteCast(_proposalId, msg.sender, _support, votingPower);
  }
}
```

### 2. Create DAO Proposal UI

File: `soundmoneymusic-main/src/components/HomeDAO/DAOProposalCreate.tsx`

```typescript
'use client';

import { useState } from 'react';
import { homeDAO } from '@/lib/contracts/HomeDAO';
import toast from 'react-hot-toast';

interface DAOProposalCreateProps {
  propertyId: string;
}

export function DAOProposalCreate({ propertyId }: DAOProposalCreateProps) {
  const [description, setDescription] = useState('');
  const [proposalType, setProposalType] = useState<0 | 1 | 2 | 3>(0);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const tx = await homeDAO.initiateDAOVote(
        propertyId,
        description,
        proposalType
      );

      await tx.wait();
      toast.success('Proposal created! Voting begins now.');
      setDescription('');
      setProposalType(0);
    } catch (error) {
      toast.error('Failed to create proposal');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Create DAO Proposal</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Proposal Type
          </label>
          <select
            value={proposalType}
            onChange={(e) => setProposalType(Number(e.target.value) as 0|1|2|3)}
            className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg"
          >
            <option value={0}>Maintenance</option>
            <option value={1}>Refinance</option>
            <option value={2}>Management</option>
            <option value={3}>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the proposal..."
            className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg"
            rows={4}
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={!description || isCreating}
          className="w-full py-2 px-4 bg-gradient-to-r from-[#FD7125] to-orange-400 text-white font-bold rounded-lg disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create Proposal'}
        </button>
      </div>
    </div>
  );
}
```

---

## Unified Backend API

### Base Endpoint

```
https://os.soundmoneyprotocol.xyz/api/homedao/
```

### Core Routes

#### Properties
```
GET    /properties              # List all properties
GET    /properties/:id          # Get property details
GET    /properties/:id/proposals  # Get DAO proposals for property
GET    /properties/:id/shareholders  # Get cap table
POST   /properties              # Create property listing
```

#### Investments
```
POST   /invest                  # Invest in property
GET    /portfolio               # Get user's holdings
POST   /allocations             # Set streaming earnings allocation
GET    /allocations             # Get user's allocations
```

#### DAO Governance
```
POST   /proposals               # Create DAO proposal
GET    /proposals/:id           # Get proposal details
POST   /proposals/:id/vote      # Cast vote
GET    /proposals/:id/votes     # Get vote results
```

#### Dividends
```
GET    /dividends               # Get dividend history
POST   /dividends/distribute    # Distribute dividends (admin)
POST   /dividends/claim         # Claim available dividends
```

#### Artist Houses
```
GET    /artist-houses           # List all artist houses
POST   /artist-houses           # Create artist house
GET    /artist-houses/:id       # Get venue details
POST   /artist-houses/:id/bookings  # Book event
```

---

## User Portfolio Integration

### Combined Portfolio Page

File: `soundmoneymusic-main/src/app/portfolio/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { StreamingEarningsCard } from '@/components/portfolio/StreamingEarningsCard';
import { RealEstateHoldingsCard } from '@/components/portfolio/RealEstateHoldingsCard';
import { PortfolioAllocationChart } from '@/components/portfolio/PortfolioAllocationChart';
import { useFetch } from '@/hooks/useFetch';

export default function PortfolioPage() {
  const user = useUserStore((state) => state.user);

  // Fetch all holdings
  const { data: streamingStats } = useFetch(
    `/api/streaming/earnings?userId=${user?.id}`
  );
  const { data: realEstateHoldings } = useFetch(
    `/api/homedao/portfolio?userId=${user?.id}`
  );

  // Calculate combined value
  const totalStreamingValue = streamingStats?.totalEarnings || 0;
  const totalRealEstateValue = realEstateHoldings?.totalValue || 0;
  const totalPortfolioValue = totalStreamingValue + totalRealEstateValue;

  const streamingAllocation = 
    (totalStreamingValue / totalPortfolioValue) * 100;
  const realEstateAllocation = 
    (totalRealEstateValue / totalPortfolioValue) * 100;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Your Portfolio</h1>
        <p className="text-2xl font-bold text-[#FD7125]">
          ${totalPortfolioValue.toFixed(2)} Total Value
        </p>
      </div>

      {/* Allocation Chart */}
      <PortfolioAllocationChart
        streaming={streamingAllocation}
        realEstate={realEstateAllocation}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Streaming Earnings */}
        <StreamingEarningsCard stats={streamingStats} />

        {/* Real Estate Holdings */}
        <RealEstateHoldingsCard holdings={realEstateHoldings} />
      </div>

      {/* Recent Activity */}
      <RecentActivity userId={user?.id} />
    </div>
  );
}
```

---

## Database Synchronization

### Real-time Updates with Socket.io

File: `api.soundmoneyprotocol.xyz/sockets/homedao.ts`

```typescript
import { io } from 'socket.io';

export function setupHomeDaoSockets(socket: Socket) {
  // Subscribe to property updates
  socket.on('subscribe:property', (propertyId: string) => {
    socket.join(`property:${propertyId}`);
  });

  // Subscribe to personal holdings
  socket.on('subscribe:portfolio', (userId: string) => {
    socket.join(`portfolio:${userId}`);
  });

  // Subscribe to DAO votes
  socket.on('subscribe:dao-vote', (proposalId: string) => {
    socket.join(`proposal:${proposalId}`);
  });
}

// When investment happens
export async function emitInvestmentUpdate(propertyId: string, shares: number) {
  io.to(`property:${propertyId}`).emit('shares-updated', {
    propertyId,
    newSharesOutstanding: shares,
  });
}

// When vote is cast
export async function emitVoteUpdate(proposalId: string, votes: any) {
  io.to(`proposal:${proposalId}`).emit('votes-updated', votes);
}

// When dividends distributed
export async function emitDividendDistribution(propertyId: string, amount: bigint) {
  io.to(`property:${propertyId}`).emit('dividend-distributed', {
    amount: amount.toString(),
  });
}
```

---

## Testing Integration

### Integration Tests

File: `tests/homedao-integration.test.ts`

```typescript
describe('HomeDAO Integration', () => {
  describe('Streaming to Real Estate', () => {
    it('should allocate streaming earnings to property investment', async () => {
      // 1. User earns from streaming
      const earnings = await streamingService.generateSessionEarnings(userId);

      // 2. Check allocation exists
      const allocations = await supabase
        .from('streaming_investment_allocations')
        .select('*')
        .eq('user_id', userId);

      // 3. Verify investment was made
      const tx = await homeDAO.investInProperty(propertyId, investAmount);
      expect(tx).to.be.ok;
    });

    it('should record investment in Supabase', async () => {
      // Investment recorded in property_shares table
      const holdings = await supabase
        .from('property_shares')
        .select('*')
        .eq('investor_id', userId);

      expect(holdings.data).to.have.length(1);
      expect(holdings.data[0].shares_held).to.equal(expectedShares);
    });
  });

  describe('DAO Voting with BEZY', () => {
    it('should use BEZY token balance as voting power', async () => {
      const bezyBalance = await bezyToken.balanceOf(voterAddress);
      const voteTx = await homeDAO.castDAOVote(proposalId, true);
      
      const proposal = await homeDAO.getDAOProposal(proposalId);
      expect(proposal.forVotes).to.equal(bezyBalance);
    });
  });

  describe('Artist House Booking', () => {
    it('should create revenue split contract for artist house event', async () => {
      const booking = await createArtistHouseBooking(venueId, artistId);
      
      const contract = await supabase
        .from('revenue_contracts')
        .select('*')
        .eq('booking_id', booking.id)
        .single();

      expect(contract.data.split_percentage).to.equal(venue.streaming_earnings_split);
    });
  });
});
```

---

## Monitoring & Analytics

### Track Integration Health

```sql
-- Dashboard query: HomeDAO integration metrics
SELECT 
  COUNT(DISTINCT investor_id) as total_investors,
  COUNT(DISTINCT property_id) as properties_invested_in,
  SUM(shares_held) as total_shares_held,
  SUM(earnings_invested) as total_earnings_invested,
  AVG(annual_yield_percentage) as avg_roi
FROM property_shares
JOIN properties ON property_shares.property_id = properties.id
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

## Support & Troubleshooting

### Common Issues

**Q: Streaming earnings not allocating to HomeDAO**
- Check `streaming_investment_allocations` table for active allocations
- Verify `allocation_percentage > 0`
- Check HomeDAO contract integration is enabled

**Q: DAO vote not counting BEZY balance**
- Ensure BEZY token contract is linked to HomeDAO
- Check user has delegated votes: `bezyToken.delegatedVotes(address)`

**Q: Artist House booking not creating revenue contract**
- Verify Artist House record exists
- Check `event_booking_enabled = true`

---

**Last Updated**: 2026-04-02
**Status**: Integration Ready
