"use client";

import React from "react";
import { User } from "@prisma/client";

import Table from "@/components/shared/table";

type Props = { users: User[] };

const Main = ({ users }: Props) => {
  return (
    <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 min-h-screen">
      <Table
        data={users}
        fields={{
          name: "Name",
          email: "Email",
          image: "Image",
          phoneNumber: "Phone",
        }}
      />
    </div>
  );
};

export default Main;
