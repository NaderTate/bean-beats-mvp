"use client";

import Table from "@/components/shared/table";
import React from "react";

type Props = {
  transactions: {
    id: string;
    _count: {
      QueueSong: number;
    };
    createdAt: Date;
    amount: number;
    tableNumber: number;
  }[];
  viewLink?: string;
};

const PaymentsTable = ({ transactions, viewLink }: Props) => {
  return (
    <div className="w-full">
      <Table
        viewLink={viewLink}
        data={transactions.map((transaction) => ({
          ...transaction,
          Songs: transaction._count.QueueSong,
          Date: new Date(transaction.createdAt).toLocaleDateString(),
        }))}
        fields={{
          tableNumber: "Table No.",
          Date: "Date",
          amount: "Total Cost",
        }}
      />
    </div>
  );
};

export default PaymentsTable;
