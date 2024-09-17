import { NextResponse, NextRequest } from "next/server";

import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    // Initialize Stripe with the secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20", // Use the latest API version
    });
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set in the environment variables"
      );
    }
    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: "price_1234",
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: `${req.headers.origin}/?success=true`,
      // cancel_url: `${req.headers.origin}/?canceled=true`,
    });
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
