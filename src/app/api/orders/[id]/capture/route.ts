import { captureOrder } from "@/utils/paypal";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { jsonResponse, httpStatusCode } = await captureOrder(params.id);
    console.log(
      "Capture Order Response:",
      jsonResponse,
      "HTTP Status Code:",
      httpStatusCode
    );
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create order: ${error}` },
      { status: 500 }
    );
  }
}
