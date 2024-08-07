import { createOrder } from "@/utils/paypal";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const { cart, value, amount } = body;
    console.log({ body });
    console.log("Cart:", cart, "Value:", value, "Amount:", amount);
    const { jsonResponse, httpStatusCode } = await createOrder({
      cart,
      value,
    });

    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create order: ${error}` },
      { status: 500 }
    );
  }
}
