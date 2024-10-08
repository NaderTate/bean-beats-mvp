// /api/stripe/checkout

import Stripe from "stripe";
import { getUser } from "@/utils/get-user";
import { NextRequest, NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { price, description, lang, shopId, songsIds, tableNumber } = data;
    console.log({ lang, shopId, price, description });
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: description,
            },
            unit_amount: parseInt(price) * 100, // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.APP_URL
      }/${lang}/shop/${shopId}/payment/success?shopId=${shopId}&tableNumber=${tableNumber}&songsIds=${songsIds.join(
        ","
      )}`,
      cancel_url: `${process.env.APP_URL}/${lang}/shop/${shopId}/payment`,
    });

    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
