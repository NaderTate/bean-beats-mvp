import React from "react";

type Props = { songsIds: string[] };

const PaymentMethod = (props: Props) => {
  const paymentMethods: Array<{
    icon: string;
    label: string;
  }> = [
    {
      icon: "/mastercard.png",
      label: "Credit Card",
    },
    {
      icon: "/paypal.png",
      label: "Paypal",
    },
    {
      icon: "/visa.png",
      label: "Visa",
    },
    {
      icon: "/g-pay.png",
      label: "Google Pay",
    },
  ];
  return (
    <div>
      {paymentMethods.map((method) => {
        return (
          <div key={method.label} className="flex items-center gap-4">
            <img src={method.icon} alt={method.label} />
            <span>{method.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentMethod;
