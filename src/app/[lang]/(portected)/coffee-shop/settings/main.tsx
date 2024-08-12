"use client";

import { useState } from "react";
import { updateUserData } from "@/actions/users";

import Input from "@/components/shared/Input";

type Props = {
  shopAdminData: {
    name: string | null | undefined;
    email: string | undefined;
    phoneNumber: string | null | undefined;
  };
};

const SettingsMain = ({ shopAdminData }: Props) => {
  const [name, setName] = useState(shopAdminData.name || "");
  const [email, setEmail] = useState(shopAdminData.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shopAdminData.phoneNumber || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await updateUserData({ name, email, phoneNumber });
    setIsLoading(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="name"
          label="Name"
          defaultValue={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          disabled
          id="email"
          type="email"
          label="Email"
          defaultValue={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="Phone Number"
          label="Phone Number"
          defaultValue={phoneNumber}
          placeholder="Phone Number"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="bg-primary-500 text-white rounded-lg px-28 py-3 mt-10"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SettingsMain;
