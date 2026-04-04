# HouseDAO Stripe Integration

## Overview

HouseDAO is fully integrated with Stripe for processing payments. The integration uses a multi-layered approach:

1. **Primary**: SoundMoney Music API (`soundmoneymusic-main`) - Real Stripe checkout sessions
2. **Fallback**: Local Stripe - If SoundMoney API is unavailable
3. **Development**: Simulated checkout - For testing without real Stripe credentials

## Architecture

```
HouseDAO (this app)
  └── /api/homedao/checkout
      ├── Try: SoundMoney Music API (/api/stripe/checkout)
      ├── Fallback: Local Stripe (if API unavailable)
      └── Fallback: Simulated checkout (for development)
```

## Environment Configuration

### Required Environment Variables

```env
# Stripe Keys (test keys for development, real keys for production)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# SoundMoney API Integration
SOUNDMONEY_API_URL=http://localhost:3001  # Development
# OR
SOUNDMONEY_API_URL=https://soundmoney.io  # Production

# Optional: API authentication (if your API requires it)
SOUNDMONEY_API_KEY=your_api_key_here

# Base URL for Stripe redirects
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Environment-Specific Configuration

#### Development (Local Testing)
```env
SOUNDMONEY_API_URL=http://localhost:3001
STRIPE_SECRET_KEY=sk_test_...  # Stripe test keys
NODE_ENV=development
```

#### Production (Deployed)
```env
SOUNDMONEY_API_URL=https://soundmoney.io  # Your API gateway
STRIPE_SECRET_KEY=sk_live_...  # Stripe live keys
NODE_ENV=production
```

## How It Works

### 1. Booking Page (`/book-studio/[id]`)
User fills out booking details and clicks "Proceed to Payment"
- Calls `/api/homedao/checkout` (POST)
- Sends: bookingId, propertyName, amount, email, bookingDetails, vvsMembership

### 2. Checkout Endpoint (`/api/homedao/checkout`)
Processes the checkout request in this order:

```javascript
// Try #1: SoundMoney Music API
if (isProduction && SOUNDMONEY_API_URL) {
  → POST to SOUNDMONEY_API_URL/api/stripe/checkout
  → Returns: { url: stripe_checkout_url, sessionId, isSimulated: false }
}

// Try #2: Local Stripe
if (STRIPE_SECRET_KEY && hasValidStripeKeys) {
  → Create Stripe session directly
  → Returns: { url: stripe_checkout_url, sessionId, isSimulated: false }
}

// Try #3: Simulated Checkout (Development)
if (all else fails) {
  → Generate test session ID (cs_test_*)
  → Return: { url: /api/homedao/checkout-simulate?session_id=..., isSimulated: true }
}
```

### 3. SoundMoney Music API (`soundmoneymusic-main`)
Real Stripe integration endpoint: `/api/stripe/checkout`
- Creates Stripe checkout sessions with full validation
- Handles VVS Concierge add-on pricing ($4,500)
- Stores metadata for tracking (bookingId, propertyId, etc.)
- Returns Stripe-hosted checkout URL

### 4. Stripe Checkout
User redirected to Stripe's hosted checkout page
- Enter card details
- Process payment
- Redirect to success/cancel page

### 5. Stripe Webhook
Webhook endpoint in `soundmoneymusic-main`: `/api/webhooks/stripe`
- Receives: checkout.session.completed events
- Handles: payment confirmation, subscription updates, etc.
- Logs transaction details

## Payment Flow

```
User Books Property
  ↓
Fills out form + clicks "Proceed to Payment"
  ↓
POST /api/homedao/checkout
  ├─ Validates: bookingId, email, amount
  ├─ Tries: SoundMoney API → Local Stripe → Simulation
  └─ Returns: Stripe URL
  ↓
Redirects to Stripe checkout
  ├─ Enter card
  ├─ Pay
  └─ Complete
  ↓
Stripe webhook: checkout.session.completed
  ├─ Update database
  ├─ Send confirmation email
  └─ Log transaction
  ↓
Redirect to /booking-success
```

## Testing

### Test Mode (Stripe Sandbox)
1. Use Stripe test keys in `.env.local`
2. Test card: `4242 4242 4242 4242`
3. Future expiry date, any 3-digit CVC
4. Check webhook events at: https://dashboard.stripe.com/webhooks

### Simulated Mode (No Stripe Keys)
1. Remove or comment out `STRIPE_SECRET_KEY`
2. Checkout redirects to simulated form: `/api/homedao/checkout-simulate`
3. Fill form and submit to test booking flow
4. Redirects to `/booking-success` after 2-second delay

### Local API Mode
1. Start SoundMoney Music API: `cd /Users/casmirpatterson/soundmoneymusic-main && npm run dev`
2. Set `SOUNDMONEY_API_URL=http://localhost:3001`
3. Requests will proxy to your local API
4. Check logs in both apps for debugging

## VVS Concierge Service

The membership add-on ($4,500) is included in checkout:

```javascript
if (vvsMembership) {
  // Add as separate line item
  {
    name: 'VVS Concierge Flawless Experience Service',
    amount: 450000,  // $4,500 in cents
  }
}

// Total = booking_amount + (vvsMembership ? 4500 : 0)
```

## Error Handling

### Scenarios Handled

| Scenario | Behavior |
|----------|----------|
| SoundMoney API down | Falls back to local Stripe |
| Local Stripe down | Falls back to simulated checkout |
| Invalid bookingId | Returns 400 error |
| Missing email | Returns 400 error |
| Invalid amount | Returns 400 error |
| Stripe error | Returns detailed error message |

### Error Messages

Users see helpful error messages:
- "Invalid request: ..." (Stripe validation)
- "Stripe authentication failed" (API key issue)
- "Failed to create checkout session" (Generic fallback)

## Webhook Integration

Stripe sends events to: `soundmoneymusic-main/api/webhooks/stripe`

Configured events:
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment processed
- `payment_intent.payment_failed` - Payment failed
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled

## Security

✅ **What's Protected**:
- Stripe Secret Key (server-side only)
- Webhook signature verification
- Metadata validation
- Email verification
- Amount verification

⚠️ **Client-Side Only**:
- Stripe Publishable Key (safe to expose)
- Property details
- Booking information

## Debugging

### Check Request Flow
1. Open browser DevTools → Network
2. Look for requests to:
   - `/api/homedao/checkout` (POST)
   - `https://checkout.stripe.com/pay/...` (Stripe)
   - `http://localhost:3001/api/stripe/checkout` (Local API)

### Check Server Logs
```bash
# HouseDAO logs
npm run dev  # Look for "Stripe session created" or "Using simulated checkout"

# SoundMoney API logs
cd /Users/casmirpatterson/soundmoneymusic-main
npm run dev  # Look for "Stripe checkout session created"
```

### Check Stripe Dashboard
1. Go to https://dashboard.stripe.com/test/payments
2. Look for recent transactions
3. Click to see metadata: bookingId, propertyId, etc.

## Deployment

### Production Checklist
- [ ] Real Stripe keys in production `.env`
- [ ] `SOUNDMONEY_API_URL` points to production API
- [ ] Webhook URL registered in Stripe Dashboard
- [ ] Webhook signing secret in `soundmoneymusic-main` env
- [ ] Test payment flow end-to-end
- [ ] Monitor webhook delivery in Stripe Dashboard
- [ ] Set up email notifications for payment success
- [ ] Test error scenarios (declined cards, etc.)

### Stripe Dashboard Setup
1. Go to https://dashboard.stripe.com/webhooks
2. Create new endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: checkout.session.completed, payment_intent.succeeded, etc.
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`
5. Test webhook delivery

## Support

For issues:
1. Check `.env.local` configuration
2. Verify Stripe API keys are correct
3. Check browser console for errors
4. Check server logs for detailed error messages
5. Test with Stripe test mode first
6. Review Stripe Dashboard for transaction details

## References

- [Stripe Checkout Docs](https://stripe.com/docs/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)
- [HouseDAO API Routes](/src/app/api/homedao/)
