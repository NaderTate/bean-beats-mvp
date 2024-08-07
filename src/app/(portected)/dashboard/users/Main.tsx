"use client";

import Table from "@/components/shared/table";
import { User } from "@prisma/client";
import React from "react";

type Props = { users: User[] };

const Main = ({ users }: Props) => {
  return (
    <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen pt-20">
      <Table
        data={users}
        fields={{ name: "Name", email: "Email", image: "Image" }}
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

export default Main;
