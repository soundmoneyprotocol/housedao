export const dynamic = 'force-dynamic';

// In-memory storage for simulated checkout sessions (fallback for development)
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
  vvsMembership?: boolean;
  propertyId?: string;
}

/**
 * POST /api/homedao/checkout
 * Creates Stripe checkout sessions by proxying to soundmoneymusic-main API
 * Falls back to simulated checkout in development mode
 */
export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();

    // Validate required fields
    if (!body.bookingId || !body.amount || !body.email) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to use the real API service first
    const apiBaseUrl = process.env.SOUNDMONEY_API_URL || 'https://soundmoney.io';
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && apiBaseUrl !== 'https://soundmoney.io') {
      try {
        const response = await fetch(`${apiBaseUrl}/api/stripe/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.SOUNDMONEY_API_KEY && {
              Authorization: `Bearer ${process.env.SOUNDMONEY_API_KEY}`,
            }),
          },
          body: JSON.stringify({
            bookingId: body.bookingId,
            propertyName: body.propertyName,
            amount: body.amount,
            email: body.email,
            bookingDetails: body.bookingDetails,
            vvsMembership: body.vvsMembership || false,
            propertyId: body.propertyId,
          }),
        });

        if (response.ok) {
          const checkoutData = await response.json();
          console.log('Stripe session created via API:', {
            sessionId: checkoutData.sessionId,
            bookingId: body.bookingId,
          });

          return Response.json({
            url: checkoutData.url,
            sessionId: checkoutData.sessionId,
            isSimulated: false,
          });
        }

        // If API fails, fall through to local Stripe or simulation
        console.warn('API checkout failed, falling back to local Stripe');
      } catch (apiError) {
        console.error('API call failed:', apiError);
        // Fall through to local handling
      }
    }

    // Try local Stripe if configured
    const hasLocalStripeKeys = process.env.STRIPE_SECRET_KEY &&
                               !process.env.STRIPE_SECRET_KEY.includes('test_');

    if (hasLocalStripeKeys) {
      try {
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
            ...(body.vvsMembership
              ? [
                  {
                    price_data: {
                      currency: 'usd',
                      product_data: {
                        name: 'VVS Concierge Service',
                        description: 'Premium concierge and exclusive perks',
                      },
                      unit_amount: 450000, // $4,500
                    },
                    quantity: 1,
                  },
                ]
              : []),
          ],
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking-cancelled`,
          customer_email: body.email,
          metadata: {
            bookingId: body.bookingId,
            propertyName: body.propertyName,
            propertyId: body.propertyId || '',
            vvsMembership: body.vvsMembership ? 'true' : 'false',
          },
        });

        console.log('Local Stripe session created:', {
          sessionId: session.id,
          bookingId: body.bookingId,
        });

        return Response.json({
          url: session.url,
          sessionId: session.id,
          isSimulated: false,
        });
      } catch (stripeError) {
        console.error('Local Stripe error:', stripeError);
        // Fall through to simulation
      }
    }

    // Fall back to simulated checkout for development/testing
    const sessionId = `cs_test_${Math.random().toString(36).substr(2, 24)}`;

    simulatedSessions.set(sessionId, {
      bookingId: body.bookingId,
      propertyName: body.propertyName,
      amount: body.amount,
      email: body.email,
      bookingDetails: body.bookingDetails,
      vvsMembership: body.vvsMembership || false,
      createdAt: new Date().toISOString(),
      status: 'open',
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const checkoutUrl = `${baseUrl}/api/homedao/checkout-simulate?session_id=${sessionId}`;

    console.log('Using simulated checkout:', {
      sessionId,
      bookingId: body.bookingId,
    });

    return Response.json({
      url: checkoutUrl,
      isSimulated: true,
      sessionId: sessionId,
    });
  } catch (error: any) {
    console.error('Checkout error:', error.message);

    return Response.json({
      error: 'Checkout failed',
      details: error.message,
    }, { status: 500 });
  }
}

/**
 * GET /api/homedao/checkout
 * Retrieves checkout session details
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return Response.json({ error: 'Session ID required' }, { status: 400 });
  }

  // Check if it's a real Stripe session (starts with cs_)
  if (sessionId.startsWith('cs_')) {
    try {
      const apiBaseUrl = process.env.SOUNDMONEY_API_URL || 'https://soundmoney.io';
      const response = await fetch(
        `${apiBaseUrl}/api/stripe/checkout?session_id=${encodeURIComponent(sessionId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.SOUNDMONEY_API_KEY && {
              Authorization: `Bearer ${process.env.SOUNDMONEY_API_KEY}`,
            }),
          },
        }
      );

      if (response.ok) {
        const sessionData = await response.json();
        return Response.json(sessionData);
      }

      // Fall back to local Stripe
      try {
        const Stripe = require('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return Response.json({
          sessionId: session.id,
          status: session.status,
          email: session.customer_email,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          metadata: session.metadata,
          paymentStatus: session.payment_status,
        });
      } catch (stripeError) {
        console.error('Stripe retrieval error:', stripeError);
        return Response.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
    } catch (apiError) {
      console.error('API retrieval error:', apiError);
      return Response.json(
        { error: 'Failed to retrieve session' },
        { status: 500 }
      );
    }
  }

  // Check simulated sessions
  const session = simulatedSessions.get(sessionId);
  if (!session) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  return Response.json({ session });
}
