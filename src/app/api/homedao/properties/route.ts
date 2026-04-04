export const dynamic = 'force-dynamic';

const mockProperties = [
  {
    id: '3',
    name: 'Miami Recording Studio',
    city: 'Miami',
    latitude: '25.7617',
    longitude: '-80.1918',
    description: 'Professional recording studio with state-of-the-art equipment. Available for hourly and daily bookings for artists and producers.',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    valuationUsd: 1500000,
    annualYieldPercentage: 7.5,
    maxShareSupply: 600,
    isArtistHouse: true,
    isBookable: true,
    hourlyRate: 250,
    dailyRate: 1500,
    currentSharePrice: 2500,
    sharesAvailable: 150,
  },
  {
    id: '6',
    name: 'Billionaires Row London',
    city: 'London',
    latitude: '51.5074',
    longitude: '-0.1278',
    description: 'Ultra-luxury Mayfair mansion with state-of-the-art recording facilities and premium private listening suite for exclusive artist sessions and events.',
    imageUrl: '/studio-soho.png',
    valuationUsd: 28000000,
    annualYieldPercentage: 10.5,
    maxShareSupply: 5500,
    isArtistHouse: true,
    isBookable: true,
    hourlyRate: 500,
    dailyRate: 2500,
    currentSharePrice: 5091,
    sharesAvailable: 1800,
  },
  {
    id: '5',
    name: 'Billionaires Row NYC',
    city: 'New York',
    latitude: '40.7735',
    longitude: '-73.9822',
    description: 'Exclusive penthouse on Manhattan\'s prestigious Billionaires Row with private listening room and world-class recording studio for artist sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    valuationUsd: 25000000,
    annualYieldPercentage: 9.8,
    maxShareSupply: 5000,
    isArtistHouse: true,
    isBookable: true,
    hourlyRate: 750,
    dailyRate: 4000,
    currentSharePrice: 5000,
    sharesAvailable: 2100,
  },
  {
    id: '2',
    name: 'Artist House LA',
    city: 'Los Angeles',
    latitude: '34.0522',
    longitude: '-118.2437',
    description: 'Creative hub and residential space for emerging artists with studio facilities and resort-style amenities.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    valuationUsd: 3200000,
    annualYieldPercentage: 8.2,
    maxShareSupply: 1200,
    isArtistHouse: true,
    isBookable: true,
    hourlyRate: 300,
    dailyRate: 1800,
    currentSharePrice: 2667,
    sharesAvailable: 320,
  },
  {
    id: '4',
    name: 'Nashville Music Venue',
    city: 'Nashville',
    latitude: '36.1627',
    longitude: '-86.7816',
    description: 'Live music venue and event space with state-of-the-art acoustics and recording studio.',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    valuationUsd: 1800000,
    annualYieldPercentage: 12.5,
    maxShareSupply: 800,
    isArtistHouse: true,
    isBookable: true,
    hourlyRate: 350,
    dailyRate: 2000,
    currentSharePrice: 2250,
    sharesAvailable: 150,
  },
  {
    id: '1',
    name: 'Brooklyn Loft',
    city: 'New York',
    latitude: '40.6501',
    longitude: '-73.9496',
    description: 'Modern loft in the heart of Brooklyn with exposed brick and floor-to-ceiling windows.',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    valuationUsd: 2500000,
    annualYieldPercentage: 6.5,
    maxShareSupply: 1000,
    isArtistHouse: false,
    isBookable: true,
    hourlyRate: 200,
    dailyRate: 1200,
    currentSharePrice: 2500,
    sharesAvailable: 450,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const minRoi = searchParams.get('minRoi');
  const isArtistHouse = searchParams.get('isArtistHouse');

  let filtered = mockProperties;

  if (city) {
    filtered = filtered.filter((p) => p.city.toLowerCase() === city.toLowerCase());
  }

  if (minRoi) {
    const roi = parseFloat(minRoi);
    filtered = filtered.filter((p) => p.annualYieldPercentage >= roi);
  }

  if (isArtistHouse === 'true') {
    filtered = filtered.filter((p) => p.isArtistHouse);
  }

  return Response.json({ properties: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.city) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a real app, this would save to database
    // For now, just return success
    const newProperty = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      currentSharePrice: body.valuationUsd ? body.valuationUsd / body.maxShareSupply : 0,
      sharesAvailable: body.maxShareSupply || 0,
      isBookable: true,
      hourlyRate: 200,
      dailyRate: 1200,
    };

    return Response.json({ property: newProperty }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return Response.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
