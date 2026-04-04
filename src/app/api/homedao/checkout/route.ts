export const dynamic = 'force-dynamic';

// In-memory storage for simulated checkout sessions
const simulatedSessions: Map<string, any> = new Map();

interface CheckoutRequest {
  bookingId: string;
  propertyName: string;
  amount: number;
  email: string;
  bookingDetails: {
    date: string;
    time: string;
    duration: string;
  };
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();

    // Generate a simulated Stripe session ID
    const sessionId = `cs_test_${Math.random().toString(36).substr(2, 24)}`;
    
    // Store the session details
    simulatedSessions.set(sessionId, {
      bookingId: body.bookingId,
      propertyName: body.propertyName,
      amount: body.amount,
      email: body.email,
      bookingDetails: body.bookingDetails,
      createdAt: new Date().toISOString(),
      status: 'open',
    });

    // Check if Stripe is configured with real keys (not test keys)
    const hasRealStripeKeys = process.env.STRIPE_SECRET_KEY && 
                              !process.env.STRIPE_SECRET_KEY.includes('test_') &&
                              !process.env.STRIPE_SECRET_KEY.includes('sk_test');

    if (hasRealStripeKeys) {
      try {
        // Use real Stripe if properly configured
        const Stripe = require('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `${body.propertyName} Booking`,
                  description: `Date: ${body.bookingDetails.date} | Duration: ${body.bookingDetails.duration}`,
                },
                unit_amount: Math.round(body.amount * 100),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking-cancelled`,
          customer_email: body.email,
          metadata: {
            bookingId: body.bookingId,
            propertyName: body.propertyName,
          },
        });

        return Response.json({ url: session.url });
      } catch (stripeError) {
        console.error('Real Stripe error:', stripeError);
        // Fall through to simulated checkout
      }
    }

    // Simulate Stripe checkout - return a simulated checkout page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const checkoutUrl = `${baseUrl}/api/homedao/checkout-simulate?session_id=${sessionId}`;

    return Response.json({ 
      url: checkoutUrl,
      isSimulated: true,
      sessionId: sessionId,
    });
  } catch (error: any) {
    console.error('Checkout error:', error.message);

    return Response.json({
      success: false,
      error: 'Checkout failed',
    }, { status: 500 });
  }
}

// Endpoint to retrieve simulated session
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return Response.json({ error: 'Session ID required' }, { status: 400 });
  }

  const session = simulatedSessions.get(sessionId);
  if (!session) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  return Response.json({ session });
}
