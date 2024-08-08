"use client";

import { deleteUser } from "@/actions/users";
import Table from "@/components/shared/table";
import { User } from "@prisma/client";
import React from "react";

type Props = { users: User[] };

const Main = ({ users }: Props) => {
  return (
    <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 min-h-screen">
      <Table
        data={users}
        // deleteFn={deleteUser}
        fields={{ name: "Name", email: "Email", image: "Image" }}
      />
    </div>
  );
};

export default Main;
