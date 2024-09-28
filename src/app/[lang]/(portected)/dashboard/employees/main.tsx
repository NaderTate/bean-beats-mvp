"use client";

import Table from "@/components/shared/table";
import { User, AdminPermission } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getReadablePermission } from "@/utils/permission-to-text";
import { useRouter } from "next/navigation";
import DashboardEmployeeForm from "@/components/shared/Forms/dashboard-empoyee";
import Modal from "@/components/shared/Modal";

type Props = { employees: User[] };

const EmployeesMain = ({ employees }: Props) => {
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
        editForm={<DashboardEmployeeForm onSubmit={toggleModal} />}
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
          phoneNumber: "Phone",
          permissions: "Permissions",
        }}
      />

      <Modal open={isOpen} title="Create new shop" setOpen={toggleModal}>
        <DashboardEmployeeForm onSubmit={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};

export default EmployeesMain;
