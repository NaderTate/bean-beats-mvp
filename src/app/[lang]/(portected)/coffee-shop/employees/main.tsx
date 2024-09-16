"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

import Table from "@/components/shared/table";
import Modal from "@/components/shared/Modal";
import EmployeeForm from "@/components/shared/Forms/employee";
import { useTranslations } from "next-intl";
import { removeEmployeeFromShop } from "@/actions/employee";

type Props = { shopId: string; employees: User[] };

const EmployeesMain = ({ employees, shopId }: Props) => {
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
        deleteFn={removeEmployeeFromShop}
        editForm={<EmployeeForm shopId={shopId} onSubmit={toggleModal} />}
        addBtnLabel={t("Add New Employee")}
        add={() => setIsOpen(true)}
        data={employees.map((employee, i) => ({
          ...employee,
          number: i + 1,
        }))}
        fields={{
          number: "#",
          name: "Name",
          email: "Email",
        }}
      />

      <Modal open={isOpen} title="Add New Employee" setOpen={toggleModal}>
        <EmployeeForm shopId={shopId} onSubmit={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};

export default EmployeesMain;
