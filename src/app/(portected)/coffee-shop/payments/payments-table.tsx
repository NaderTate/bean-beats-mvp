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
};

const PaymentsTable = ({ transactions }: Props) => {
  return (
    <div>
      <Table
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
        actions={[
          {
            title: "Edit",
            cb: (id: string) => console.log("Edit", id),
          },
          {
            title: "Delete",
            cb: (id: string) => console.log("Delete", id),
          },
        ]}
      />
    </div>
  );
};

export default PaymentsTable;
