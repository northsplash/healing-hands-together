[README.md](https://github.com/user-attachments/files/30920794/README.md)
# Healing Hands Together LLC

A white-and-pink React/Vite site with a custom enrollment experience and Stripe-backed payment-plan architecture.

## Run locally

1. Copy `.env.example` to `.env`.
2. Add your Stripe test secret key.
3. Run `npm install`.
4. Start the frontend with `npm run dev`.
5. Start the API in another terminal with `npm run server`.

For production, deploy the frontend and API separately (or adapt the API to a serverless function) and set environment variables in your hosting provider.

## Important payment note

The site owns the enrollment UI and payment-plan logic, but raw card data is handled by Stripe Checkout. Do not place secret Stripe keys in the frontend.

The current webhook is a foundation. Before accepting real tuition payments, connect the webhook to a database and implement final-installment tracking/cancellation, refund rules, enrollment agreements, and school-specific payment terms.
