"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CoffeeShop, User } from "@prisma/client";

import Table from "@/components/shared/table";
import Modal from "@/components/shared/Modal";
import ShopForm from "@/components/shared/Forms/shop";
import ShopData from "./shop-data";

type Props = { shops: (CoffeeShop & { admin: User })[] };

const ShopsMain = ({ shops }: Props) => {
  const { refresh } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const toggleModal = () => {
    setTimeout(() => {
      refresh();
    }, 1000);
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <Table
        viewModal={<ShopData />}
        editForm={<ShopForm onSubmit={toggleModal} />}
        addBtnLabel={t("Add New Shop")}
        add={() => setIsOpen(true)}
        data={shops.map((shop, i) => ({
          ...shop,
          number: i + 1,
          adminName: shop.admin.name,
          adminEmail: shop.admin.email,
          AdaminPhone: shop.admin.phoneNumber,
        }))}
        fields={{
          number: "#",
          name: "Shop Name",
          adminName: "Admin Name",
          adminEmail: "Admin Email",
          AdaminPhone: "Admin Phone",
        }}
      />

      <Modal open={isOpen} title="Create new shop" setOpen={toggleModal}>
        <ShopForm onSubmit={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};

export default ShopsMain;
