"use server";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api.sandbox.paypal.com";
// const base = "https://api.paypal.com";

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

export const handleResponse = async (response: Response) => {
  try {
    const jsonResponse = await response.json();
    console.log("PayPal API Response:", jsonResponse, response.status);
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};

export const captureOrder = async (orderID: string) => {
  const accessToken = await generateAccessToken();
  console.log({ accessToken });
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only).
      // Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

export const createSubscription = async ({ plan_id }: { plan_id: string }) => {
  const accessToken = await generateAccessToken();
  console.log("Access Token:", accessToken);
  const url = `${base}/v1/billing/subscriptions`;

  const payload = {
    plan_id,
  };

  const response = await fetch(url, {
    headers: {
      Prefer: "return=representation",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const createOrder = async ({
  cart,
  value,
}: {
  cart: any;
  value: number;
}) => {
  const accessToken = await generateAccessToken();
  console.log("Access Token:", accessToken);
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value,
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only).
      // Documentation: https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const cancelSubscription = async ({
  subscriptionID,
}: {
  subscriptionID: string;
}) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v1/billing/subscriptions/${subscriptionID}/cancel`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
  });
  return handleResponse(response);
};

export const getSusbcriptionDetails = async ({
  subscriptionID,
}: {
  subscriptionID: string;
}) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v1/billing/subscriptions/${subscriptionID}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return handleResponse(response);
};
