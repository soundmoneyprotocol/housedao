export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.propertyId || !body.shares) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a real app, this would:
    // 1. Verify user wallet/auth
    // 2. Execute smart contract transaction
    // 3. Record investment in database
    // For now, just return success with mock data
    const investment = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: body.propertyId,
      shares: body.shares,
      amountUsd: body.amountUsd,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    return Response.json({ investment }, { status: 201 });
  } catch (error) {
    console.error('Error recording investment:', error);
    return Response.json({ error: 'Failed to record investment' }, { status: 500 });
  }
}
