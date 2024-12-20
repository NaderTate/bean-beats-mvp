"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, cloneElement } from "react";

import Modal from "./Modal";
import ConfirmDelete from "./confirm-delete";

import { MdEdit } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { AdminPermission } from "@prisma/client";
import { getReadablePermission } from "@/utils/permission-to-text";
import VerifyButton from "./verify-btn";

interface TableProps {
  fields: any;
  data: any;
  pages?: number;
  page?: number;
  options?: any;
  editForm?: any;
  add?: () => void;
  viewLink?: string;
  deleteFn?: (id: string) => Promise<void>;
  viewModal?: any;
  hideSearch?: boolean;
  addBtnLabel?: string;
  filters?: React.ReactNode[];
  verifyFn?: (id: string) => Promise<void>;
}

export default function Table({
  fields,
  data,
  pages = 1,
  page = 1,
  options,
  editForm,
  add,
  viewLink,
  deleteFn,
  viewModal,
  hideSearch = false,
  addBtnLabel,
  filters,
  verifyFn,
}: TableProps) {
  const [modifiedData, setModifiedData] = useState(data);
  const [openEdit, setOpenEdit] = useState<number | null>(null);
  const [openView, setOpenView] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Create an array of all AdminPermission values
  const allPermissions = Object.values(AdminPermission);

  useEffect(() => {
    setModifiedData(data);
  }, [data]);

  useEffect(() => {
    if (searchTerm === "") {
      setModifiedData(data);
    } else {
      const filteredData = data.filter((item: any) =>
        Object.keys(fields).some((key) =>
          String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setModifiedData(filteredData);
    }
  }, [data, fields, searchTerm]);

  const keys = Object.keys(fields);

  const handleModalClose = () => {
    setOpenEdit(null);
  };

  const t = useTranslations();

  return (
    <div className="mt-5 rounded-lg">
      <div className="flex justify-between items-center gap-2 py-4">
        {!hideSearch && (
          <div className="flex items-end gap-4 w-full">
            <div className=" mx-auto text-gray-600 border-2 border-gray-300  px-5 h-10 md:h-14  rounded-lg text-sm flex-1 flex justify-between items-center gap-5">
              <input
                type="search"
                name="search"
                value={searchTerm}
                placeholder={t("Search") + "..."}
                className="focus:outline-none flex-1 h-full"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button title="search" type="submit" className="">
                <CiSearch className="text-gray-600  text-2xl" />
              </button>
            </div>
            <div className="flex gap-4">{filters}</div>
          </div>
        )}
        {add && (
          <button
            onClick={add}
            className=" bg-primary hover:bg-primary/80 transition text-white rounded-lg py-2 px-4 whitespace-nowrap md:px-10 md:py-4 flex items-center gap-2"
          >
            <IoMdAddCircle className="text-xl" size={25} />
            {addBtnLabel ? t(addBtnLabel) : t("Add")}
          </button>
        )}
      </div>

      <div className="border bg-white border-primary/20 shadow-sm rounded-lg overflow-x-scroll md:overflow-hidden">
        <table className="min-w-full divide-y-2 divide-gray-200 text-sm ">
          <thead className="bg-gray-100 ltr:text-left rtl:text-right w-full">
            <tr className="bg-gray-100">
              {keys.map((key) => (
                <td
                  key={key + "tabel-fields"}
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  {t(fields?.[key])}
                </td>
              ))}
              {(viewLink || editForm || deleteFn || viewModal) && (
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {t("Actions")}
                </td>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {modifiedData.map((item: any, index: number) => (
              <tr key={item?.id + index}>
                {keys.map((key) => (
                  <td
                    key={key + "field"}
                    className="whitespace-nowrap px-4 py-2 text-gray-700"
                  >
                    {key === "image" || key === "thumbnail" ? (
                      <Image
                        alt={key}
                        width={200}
                        height={200}
                        src={item?.[key] || "/images/unkown.jpeg"}
                        className="aspect-square w-12 object-cover rounded-full border border-gray-200 overflow-hidden"
                      />
                    ) : Array.isArray(item?.[key]) ? (
                      t(
                        item[key]
                          .map((value) =>
                            allPermissions.includes(value)
                              ? getReadablePermission(value)
                              : value
                          )
                          .join(", ") || "-"
                      )
                    ) : allPermissions.includes(item?.[key]) ? (
                      t(getReadablePermission(item[key]))
                    ) : (
                      t(item?.[key] ?? "-")
                    )}
                  </td>
                ))}
                {(viewLink ||
                  editForm ||
                  viewModal ||
                  deleteFn ||
                  verifyFn) && (
                  <td className="flex items-center gap-x-5 px-4 py-2 mt-4">
                    {viewLink && (
                      <Link href={`${viewLink}/${item?.id}`} prefetch>
                        <FaInfoCircle className="text-primary" size={20} />
                      </Link>
                    )}
                    {deleteFn && (
                      <ConfirmDelete deleteFn={() => deleteFn(item.id)} />
                    )}
                    {editForm && (
                      <>
                        <MdEdit
                          size={20}
                          onClick={() =>
                            setOpenEdit(openEdit === index ? null : index)
                          }
                          className="text-primary cursor-pointer"
                        />

                        <Modal
                          title={t("Edit")}
                          open={openEdit === index}
                          setOpen={() => setOpenEdit(null)}
                        >
                          {cloneElement(editForm, {
                            key: item.id,
                            itemToEdit: item,
                            onSubmit: handleModalClose,
                          })}
                        </Modal>
                      </>
                    )}
                    {viewModal && (
                      <>
                        <FaInfoCircle
                          size={20}
                          onClick={() =>
                            setOpenView(openEdit === index ? null : index)
                          }
                          className="text-primary cursor-pointer"
                        />
                        <Modal
                          open={openView === index}
                          setOpen={() => setOpenView(null)}
                        >
                          {cloneElement(viewModal, {
                            key: item.id,
                            data: item,
                          })}
                        </Modal>
                      </>
                    )}
                    {verifyFn &&
                      (item.isVerified == "Pending" ? (
                        <VerifyButton userId={item.id} />
                      ) : (
                        ""
                      ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
