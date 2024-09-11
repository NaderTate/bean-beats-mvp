"use client";

import { useState } from "react";
import toast from "react-hot-toast";
// import { updateUserPlan } from "@/actions/users";
// import { getSusbcriptionDetails } from "@/utils/paypal";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useTranslations } from "next-intl";

type PayPalBtnProps =
  | { action: "order"; amount: number; onPaymentSuccess: () => void }
  | {
      action: "subscription";
      plan_id: string;

      onSubscriptionSuccess?: () => void;
    };

export const PayPalBtn = (props: PayPalBtnProps) => {
  const t = useTranslations();
  const [{ options, isPending }] = usePayPalScriptReducer();
  // const [currency, setCurrency] = useState(options.currency);
  const [message, setMessage] = useState("");
  const buttonStyles: {
    color?: "gold" | "blue" | "silver" | "white" | "black";
    disableMaxWidth?: boolean;
    height?: number;
    label?:
      | "paypal"
      | "checkout"
      | "buynow"
      | "pay"
      | "installment"
      | "subscribe"
      | "donate";
    layout?: "vertical" | "horizontal";
    shape?: "rect" | "pill";
    tagline?: boolean;
  } = {
    layout: "vertical",
    color: "gold",
    shape: "pill",
    label: "paypal",
  };

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (props.action === "order") {
    return (
      <PayPalButtons
        className="w-full"
        style={buttonStyles}
        createOrder={async () => {
          try {
            const response = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              // use the "body" param to optionally pass additional order information
              // like product ids and quantities
              body: JSON.stringify({
                cart: [
                  {
                    id: "item-123",
                    quantity: 1,
                  },
                ],
                value: props.amount,
                amount: 69,
              }),
            });

            const orderData = await response.json();
            if (orderData.id) {
              return orderData.id;
            } else {
              const errorDetail = orderData?.details?.[0];
              const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error(error);
            setMessage(`Could not initiate PayPal Checkout...${error}`);
          }
        }}
        onApprove={async (data, actions) => {
          try {
            props.onPaymentSuccess && (await props.onPaymentSuccess());
            const response = await fetch(
              `/api/orders/${data.orderID}/capture`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const orderData = await response.json();
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
              return actions.restart();
            } else if (errorDetail) {
              // (2) Other non-recoverable errors -> Show a failure message
              throw new Error(
                `${errorDetail.description} (${orderData.debug_id})`
              );
            } else {
              // (3) Successful transaction -> Show confirmation or thank you message
              // Or go to another URL:  actions.redirect('thank_you.html');
              const transaction =
                orderData.purchase_units[0].payments.captures[0];
              console.log(orderData.status, transaction.status, transaction.id);
              if (orderData.status === "COMPLETED") {
                props.onPaymentSuccess && props.onPaymentSuccess();
              } else {
                toast.error(t("Payment failed!"));
              }
              setMessage(
                `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
              );
              console.log(
                "Capture result",
                orderData,
                JSON.stringify(orderData, null, 2)
              );
            }
          } catch (error) {
            console.error(error);
            setMessage(
              `Sorry, your transaction could not be processed...${error}`
            );
          }
        }}
      />
    );
  }

  // if (props.action === "subscription") {
  //   return (
  //     <PayPalButtons
  //       createSubscription={async () => {
  //         try {
  //           const response = await fetch("/api/subscriptions", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               plan_id: props.plan_id,
  //             }),
  //           });

  //           const subscriptionData = await response.json();

  //           if (subscriptionData.id) {
  //             const checkSubscriptionStatus = async () => {
  //               const subscriptionDetails = await getSusbcriptionDetails({
  //                 subscriptionID: subscriptionData.id,
  //               });
  //               console.log({ subscriptionDetails });
  //               if (subscriptionDetails.jsonResponse.status === "ACTIVE") {
  //                 clearInterval(interval);
  //                 await updateUserPlan({
  //                   plan: props.plan,
  //                   plan_id: subscriptionData.id,
  //                   subscriptionStatus: "ACTIVE",
  //                 }).then(() => {
  //                   toast.success("Subscription successful!");
  //                   props.onSubscriptionSuccess &&
  //                     props.onSubscriptionSuccess();
  //                 });
  //               }
  //             };

  //             let elapsedTime = 0;
  //             const intervalDuration = 4000; // 4 seconds
  //             const maxTime = 120000; // 2 minutes in milliseconds

  //             const interval = setInterval(() => {
  //               elapsedTime += intervalDuration;
  //               if (elapsedTime >= maxTime) {
  //                 clearInterval(interval);
  //               } else {
  //                 checkSubscriptionStatus();
  //               }
  //             }, intervalDuration);
  //             checkSubscriptionStatus();

  //             return subscriptionData.id;
  //           } else {
  //             const errorDetail = subscriptionData?.details?.[0];
  //             const errorMessage = errorDetail
  //               ? `${errorDetail.issue} ${errorDetail.description} (${subscriptionData.debug_id})`
  //               : JSON.stringify(subscriptionData);

  //             throw new Error(errorMessage);
  //           }
  //         } catch (error) {
  //           console.error(error);
  //           setMessage(`Could not initiate PayPal Subscription...${error}`);
  //         }
  //       }}
  //       style={buttonStyles}
  //     />
  //   );
  // }
};
