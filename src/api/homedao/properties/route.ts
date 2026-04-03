import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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

    let query = supabase.from('properties').select('*').eq('status', 'active');

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (minROI) {
      query = query.gte('annual_yield_percentage', parseInt(minROI) * 100);
    }

    if (isArtistHouse === 'true') {
      query = query.eq('is_artist_house', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
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
    const { user } = await request.json().catch(() => ({ user: null }));

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('properties')
      .insert({
        blockchain_id: body.blockchainId,
        creator_id: user.id,
        name: body.name,
        city: body.city,
        latitude: body.latitude,
        longitude: body.longitude,
        description: body.description,
        image_url: body.imageUrl,
        valuation_usd: body.valuationUsd, // in cents
        annual_yield_percentage: body.annualYieldPercentage, // in basis points
        max_share_supply: body.maxShareSupply,
        is_artist_house: body.isArtistHouse || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error listing property:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
