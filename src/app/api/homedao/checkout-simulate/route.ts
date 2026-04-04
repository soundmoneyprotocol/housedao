export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return new Response('Session ID required', { status: 400 });
  }

  // Return simulated Stripe checkout HTML
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Checkout</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 440px;
          padding: 40px;
        }
        .logo {
          margin-bottom: 30px;
          text-align: center;
        }
        .logo img {
          height: 32px;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }
        h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 32px;
        }
        .form-group {
          margin-bottom: 24px;
        }
        label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }
        input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #0891B2;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
        }
        .row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 12px;
        }
        .summary {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          font-size: 13px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #6b7280;
        }
        .summary-row.total {
          border-top: 1px solid #e5e7eb;
          padding-top: 8px;
          margin-top: 8px;
          font-weight: 600;
          color: #1f2937;
          font-size: 15px;
        }
        .summary-row.total .amount {
          color: #0891B2;
        }
        button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0891B2 0%, #06b6d4 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(8, 145, 178, 0.3);
        }
        button:active {
          transform: translateY(0);
        }
        button.loading {
          opacity: 0.8;
          cursor: not-allowed;
        }
        .security-info {
          text-align: center;
          margin-top: 16px;
          font-size: 12px;
          color: #6b7280;
        }
        .security-info svg {
          height: 16px;
          width: 16px;
          display: inline-block;
          margin-right: 4px;
          vertical-align: middle;
        }
        .error {
          color: #dc2626;
          font-size: 13px;
          margin-top: 4px;
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <div class="logo-text">HouseDAO</div>
        </div>

        <h1>Complete Payment</h1>
        <p class="subtitle">Secure payment processed by Stripe</p>

        <form id="paymentForm">
          <div class="summary" id="summaryContainer">
            <!-- Summary will be loaded here -->
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="your@email.com" required>
            <div class="error" id="emailError"></div>
          </div>

          <div class="form-group">
            <label for="cardName">Cardholder Name</label>
            <input type="text" id="cardName" name="cardName" placeholder="John Doe" required>
            <div class="error" id="cardNameError"></div>
          </div>

          <div class="form-group">
            <label for="cardNumber">Card Number</label>
            <input type="text" id="cardNumber" name="cardNumber" placeholder="4242 4242 4242 4242" maxlength="19" required>
            <div class="error" id="cardNumberError"></div>
          </div>

          <div class="row">
            <div class="form-group">
              <label for="expiry">Expiry Date</label>
              <input type="text" id="expiry" name="expiry" placeholder="MM/YY" maxlength="5" required>
              <div class="error" id="expiryError"></div>
            </div>
            <div class="form-group">
              <label for="cvc">CVC</label>
              <input type="text" id="cvc" name="cvc" placeholder="123" maxlength="4" required>
              <div class="error" id="cvcError"></div>
            </div>
          </div>

          <button type="submit" id="submitBtn">Pay Now</button>

          <div class="security-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Your payment is secure and encrypted
          </div>
        </form>
      </div>

      <script>
        const sessionId = '${sessionId}';

        // Fetch session details
        async function loadSession() {
          try {
            const response = await fetch(\`/api/homedao/checkout?session_id=\${sessionId}\`);
            const data = await response.json();

            if (data.session) {
              const session = data.session;
              const summary = document.getElementById('summaryContainer');

              summary.innerHTML = \`
                <div class="summary-row">
                  <span>\${session.propertyName}</span>
                  <span>$\${(session.amount / 100).toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span class="amount">$\${(session.amount / 100).toFixed(2)}</span>
                </div>
              \`;

              document.getElementById('email').value = session.email;
            }
          } catch (error) {
            console.error('Failed to load session:', error);
          }
        }

        // Format card number
        document.getElementById('cardNumber').addEventListener('input', (e) => {
          let value = e.target.value.replace(/\\s/g, '');
          let formatted = value.replace(/(\\d{4})(?=\\d)/g, '$1 ');
          e.target.value = formatted;
        });

        // Format expiry
        document.getElementById('expiry').addEventListener('input', (e) => {
          let value = e.target.value.replace(/\\D/g, '');
          if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
          }
          e.target.value = value;
        });

        // Format CVC
        document.getElementById('cvc').addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\\D/g, '');
        });

        // Validate form
        function validateForm() {
          let isValid = true;

          const email = document.getElementById('email').value;
          if (!email.includes('@')) {
            document.getElementById('emailError').textContent = 'Valid email required';
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
          }

          const cardNumber = document.getElementById('cardNumber').value.replace(/\\s/g, '');
          if (cardNumber.length !== 16) {
            document.getElementById('cardNumberError').textContent = 'Card number must be 16 digits';
            document.getElementById('cardNumberError').style.display = 'block';
            isValid = false;
          }

          const expiry = document.getElementById('expiry').value;
          if (!expiry.match(/^\\d{2}\\/\\d{2}$/)) {
            document.getElementById('expiryError').textContent = 'Format: MM/YY';
            document.getElementById('expiryError').style.display = 'block';
            isValid = false;
          }

          const cvc = document.getElementById('cvc').value;
          if (cvc.length !== 3 && cvc.length !== 4) {
            document.getElementById('cvcError').textContent = 'CVC must be 3-4 digits';
            document.getElementById('cvcError').style.display = 'block';
            isValid = false;
          }

          return isValid;
        }

        // Handle submission
        document.getElementById('paymentForm').addEventListener('submit', async (e) => {
          e.preventDefault();

          // Clear errors
          document.querySelectorAll('.error').forEach(el => el.style.display = 'none');

          if (!validateForm()) return;

          const btn = document.getElementById('submitBtn');
          btn.disabled = true;
          btn.classList.add('loading');
          btn.textContent = 'Processing...';

          // Simulate payment processing
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Redirect to success page
          window.location.href = \`/booking-success?session_id=\${sessionId}\`;
        });

        // Load session on page load
        loadSession();
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
