-- HomeDAO Tables (extends SoundMoney unified schema)
-- These tables integrate with SoundMoney users and streaming earnings

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blockchain_id BIGINT NOT NULL UNIQUE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude VARCHAR(50) NOT NULL,
  longitude VARCHAR(50) NOT NULL,
  description TEXT,
  image_url TEXT,
  valuation_usd BIGINT NOT NULL, -- in cents
  annual_yield_percentage INTEGER DEFAULT 0, -- in basis points (500 = 5%)
  max_share_supply BIGINT NOT NULL,
  shares_outstanding BIGINT DEFAULT 0,
  is_artist_house BOOLEAN DEFAULT false,
  accumulated_dividends BIGINT DEFAULT 0, -- in Wei
  status VARCHAR(50) DEFAULT 'active', -- active, paused, sold
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_properties_creator ON properties(creator_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_is_artist_house ON properties(is_artist_house);
CREATE INDEX idx_properties_blockchain_id ON properties(blockchain_id);

-- Property investments/holdings
CREATE TABLE IF NOT EXISTS property_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  shares_held BIGINT NOT NULL,
  cost_basis_usd BIGINT NOT NULL, -- total USD invested in cents
  dividends_claimed BIGINT DEFAULT 0, -- in Wei
  last_claim_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(investor_id, property_id)
);

CREATE INDEX idx_property_shares_investor ON property_shares(investor_id);
CREATE INDEX idx_property_shares_property ON property_shares(property_id);

-- DAO Proposals/Votes
CREATE TABLE IF NOT EXISTS dao_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blockchain_id BIGINT NOT NULL UNIQUE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  proposal_type INTEGER DEFAULT 0, -- 0: maintenance, 1: refinance, 2: management, 3: other
  for_votes BIGINT DEFAULT 0,
  against_votes BIGINT DEFAULT 0,
  proposed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  executed BOOLEAN DEFAULT false,
  canceled BOOLEAN DEFAULT false,
  approved BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dao_proposals_property ON dao_proposals(property_id);
CREATE INDEX idx_dao_proposals_deadline ON dao_proposals(deadline);
CREATE INDEX idx_dao_proposals_blockchain_id ON dao_proposals(blockchain_id);

-- DAO Votes
CREATE TABLE IF NOT EXISTS dao_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES dao_proposals(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  support BOOLEAN NOT NULL,
  voting_power BIGINT NOT NULL, -- BEZY tokens used for voting
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, voter_id)
);

CREATE INDEX idx_dao_votes_proposal ON dao_votes(proposal_id);
CREATE INDEX idx_dao_votes_voter ON dao_votes(voter_id);

-- Dividend distributions
CREATE TABLE IF NOT EXISTS dividends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  total_amount BIGINT NOT NULL, -- in Wei
  amount_per_share BIGINT NOT NULL, -- in Wei
  distributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_dividends_property ON dividends(property_id);
CREATE INDEX idx_dividends_distributed_at ON dividends(distributed_at);

-- Artist Houses (special venue properties)
CREATE TABLE IF NOT EXISTS artist_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_name VARCHAR(255),
  event_capacity INTEGER,
  has_streaming_integration BOOLEAN DEFAULT true,
  streaming_earnings_split INTEGER DEFAULT 8000, -- 80% to artists, 20% to venue (in basis points)
  event_booking_enabled BOOLEAN DEFAULT true,
  royalty_percentage INTEGER DEFAULT 500, -- 5% (in basis points)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_artist_houses_property ON artist_houses(property_id);
CREATE INDEX idx_artist_houses_artist ON artist_houses(artist_id);

-- Streaming earnings invested in properties (integration)
CREATE TABLE IF NOT EXISTS streaming_investment_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  allocation_percentage INTEGER NOT NULL, -- 0-100, in basis points
  earnings_invested BIGINT DEFAULT 0, -- cumulative ETH invested
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX idx_streaming_investment_user ON streaming_investment_allocations(user_id);
CREATE INDEX idx_streaming_investment_property ON streaming_investment_allocations(property_id);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE dao_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dao_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaming_investment_allocations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Properties (public read, creator-only write)
CREATE POLICY "properties_read" ON properties
  FOR SELECT USING (true);

CREATE POLICY "properties_create" ON properties
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "properties_update" ON properties
  FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies: Property Shares (investor-only read/write)
CREATE POLICY "property_shares_read" ON property_shares
  FOR SELECT USING (auth.uid() = investor_id);

CREATE POLICY "property_shares_create" ON property_shares
  FOR INSERT WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "property_shares_update" ON property_shares
  FOR UPDATE USING (auth.uid() = investor_id);

-- RLS Policies: DAO Proposals (public read)
CREATE POLICY "dao_proposals_read" ON dao_proposals
  FOR SELECT USING (true);

-- RLS Policies: DAO Votes (voter-only read/write)
CREATE POLICY "dao_votes_read" ON dao_votes
  FOR SELECT USING (auth.uid() = voter_id);

CREATE POLICY "dao_votes_create" ON dao_votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id);

-- RLS Policies: Dividends (public read)
CREATE POLICY "dividends_read" ON dividends
  FOR SELECT USING (true);

-- RLS Policies: Artist Houses (public read, artist-only write)
CREATE POLICY "artist_houses_read" ON artist_houses
  FOR SELECT USING (true);

CREATE POLICY "artist_houses_create" ON artist_houses
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "artist_houses_update" ON artist_houses
  FOR UPDATE USING (auth.uid() = artist_id);

-- RLS Policies: Streaming Investment (user-only read/write)
CREATE POLICY "streaming_investment_read" ON streaming_investment_allocations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "streaming_investment_create" ON streaming_investment_allocations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "streaming_investment_update" ON streaming_investment_allocations
  FOR UPDATE USING (auth.uid() = user_id);
