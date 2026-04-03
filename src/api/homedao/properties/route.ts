import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock properties for demo
const MOCK_PROPERTIES = [
  {
    id: '1',
    blockchain_id: 1,
    name: 'Brooklyn Loft',
    city: 'New York',
    latitude: '40.6501',
    longitude: '-73.9496',
    description: 'Modern 3-bedroom loft in the heart of Brooklyn with rooftop access.',
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
    valuation_usd: 500000000, // $5,000,000 in cents
    annual_yield_percentage: 500, // 5%
    shares_outstanding: 250,
    max_share_supply: 1000,
    is_artist_house: false,
    created_at: new Date().toISOString(),
    accumulated_dividends: 0,
    status: 'active',
  },
  {
    id: '2',
    blockchain_id: 2,
    name: 'Artist House LA',
    city: 'Los Angeles',
    latitude: '34.0522',
    longitude: '-118.2437',
    description: 'Collaborative music venue and creative space with recording studio and performance area.',
    image_url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&h=300&fit=crop',
    valuation_usd: 300000000, // $3,000,000 in cents
    annual_yield_percentage: 800, // 8%
    shares_outstanding: 150,
    max_share_supply: 500,
    is_artist_house: true,
    created_at: new Date().toISOString(),
    accumulated_dividends: 0,
    status: 'active',
  },
  {
    id: '3',
    blockchain_id: 3,
    name: 'Miami Penthouse',
    city: 'Miami',
    latitude: '25.7617',
    longitude: '-80.1918',
    description: 'Luxury penthouse with ocean views, hot tub, and private cinema.',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9b41261fbf81?w=500&h=300&fit=crop',
    valuation_usd: 400000000, // $4,000,000 in cents
    annual_yield_percentage: 600, // 6%
    shares_outstanding: 200,
    max_share_supply: 800,
    is_artist_house: false,
    created_at: new Date().toISOString(),
    accumulated_dividends: 0,
    status: 'active',
  },
  {
    id: '4',
    blockchain_id: 4,
    name: 'Nashville Music Venue',
    city: 'Nashville',
    latitude: '36.1627',
    longitude: '-86.7816',
    description: 'Historic music venue with 500-seat capacity, multiple performance stages, and artist residency program.',
    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop',
    valuation_usd: 200000000, // $2,000,000 in cents
    annual_yield_percentage: 1000, // 10%
    shares_outstanding: 100,
    max_share_supply: 400,
    is_artist_house: true,
    created_at: new Date().toISOString(),
    accumulated_dividends: 0,
    status: 'active',
  },
];

/**
 * GET /api/homedao/properties
 * Fetch all properties with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const minROI = searchParams.get('minROI');
    const isArtistHouse = searchParams.get('isArtistHouse');

    let filtered = MOCK_PROPERTIES;

    if (city) {
      filtered = filtered.filter((p) =>
        p.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (minROI) {
      const minROINum = parseInt(minROI);
      filtered = filtered.filter((p) => p.annual_yield_percentage >= minROINum * 100);
    }

    if (isArtistHouse === 'true') {
      filtered = filtered.filter((p) => p.is_artist_house);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/homedao/properties
 * List a new property (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mock: just return success for demo
    const newProperty = {
      id: String(MOCK_PROPERTIES.length + 1),
      blockchain_id: MOCK_PROPERTIES.length + 1,
      ...body,
      shares_outstanding: 0,
      accumulated_dividends: 0,
      created_at: new Date().toISOString(),
      status: 'active',
    };

    return NextResponse.json(newProperty);
  } catch (error) {
    console.error('Error listing property:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
