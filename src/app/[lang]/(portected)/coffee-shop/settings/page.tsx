import { NextPage } from "next";

import SettingsMain from "./main";

import { getCoffeeShop } from "@/utils/get-user";

type SettingsPageProps = {};

const SettingsPage: NextPage = async ({}: SettingsPageProps) => {
  const { user, coffeeShop } = await getCoffeeShop();

  return (
    <>
      <SettingsMain
        shopAdminData={{
          id: user?.id as string,
          image: user?.image,
          email: user?.email,
          name: user?.name,
          phoneNumber: user?.phoneNumber,
          otherPhone: user?.otherPhone,
          commercialRegistrationNumber: user?.commercialRegistrationNumber,
          website: user?.website,
        }}
        shopData={{
          id: coffeeShop?.id as string,
          songPrice: coffeeShop?.songPrice || 1,
          name: coffeeShop?.name,
          logo: coffeeShop?.logo,
          iban: coffeeShop?.iban,
          accountNumber: coffeeShop?.accountNumber,
          bankName: coffeeShop?.bankName,
          country: coffeeShop?.country,
          city: coffeeShop?.city,
          district: coffeeShop?.district,
          location: coffeeShop?.location as any,
          phone: coffeeShop?.phone,
          taxNumber: coffeeShop?.taxNumber,
        }}
      />
    </>
  );
};

export default SettingsPage;
