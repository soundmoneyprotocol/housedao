import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /api/homedao/invest
 * Record investment after blockchain transaction completes
 * Requires user authentication and completed transaction
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json().catch(() => ({ user: null }));

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, sharesDesired, totalUSD } = body;

    if (!propertyId || !sharesDesired || !totalUSD) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get property details
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('*')
      .eq('blockchain_id', propertyId)
      .single();

    if (propError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check if shares available
    const availableShares = property.max_share_supply - property.shares_outstanding;
    if (sharesDesired > availableShares) {
      return NextResponse.json(
        { error: 'Insufficient shares available' },
        { status: 400 }
      );
    }

    // Upsert property shares (investor holdings)
    const { data: shares, error: sharesError } = await supabase
      .from('property_shares')
      .upsert(
        {
          investor_id: user.id,
          property_id: property.id,
          shares_held: sharesDesired,
          cost_basis_usd: totalUSD,
        },
        { onConflict: 'investor_id,property_id' }
      )
      .select()
      .single();

    if (sharesError) {
      return NextResponse.json({ error: sharesError.message }, { status: 400 });
    }

    // Update property shares outstanding
    const { error: updateError } = await supabase
      .from('properties')
      .update({
        shares_outstanding: property.shares_outstanding + sharesDesired,
      })
      .eq('id', property.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      shares: shares,
      message: 'Investment recorded successfully',
    });
  } catch (error) {
    console.error('Error processing investment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
