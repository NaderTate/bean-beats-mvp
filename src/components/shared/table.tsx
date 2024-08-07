"use client";
import React, { useState, useEffect, cloneElement } from "react";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircle } from "react-icons/io";
import Modal from "./Modal";

export default function Table({
  fields,
  data,
  pages = 1,
  page = 1,
  options,
  editForm,
  add,
}: any) {
  const [modifiedData, setModifiedData] = React.useState(data);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div>
      <div className="flex justify-between items-center gap-2 py-4 mb-10">
        <div className=" mx-auto text-gray-600 border-2 border-gray-300 bg-white px-5 h-10 md:h-14  rounded-lg text-sm flex-1 flex justify-between items-center gap-5">
          <input
            className="focus:outline-none flex-1 h-full"
            type="search"
            name="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button title="search" type="submit" className="">
            <CiSearch className="text-gray-600  text-2xl" />
          </button>
        </div>
        {add && (
          <button
            onClick={() => add()}
            className=" bg-primary hover:bg-primary/80 transition text-white rounded-lg py-2 px-4  md:px-10 md:py-4 flex items-center gap-2"
          >
            <IoMdAddCircle className="text-xl" />
            Add
          </button>
        )}
      </div>

      <div className="border bg-white border-primary/20 shadow-md rounded-xl overflow-x-scroll md:overflow-hidden p-1">
        <table className="min-w-full divide-y-2 divide-gray-200 e text-sm ">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              {keys.map((key) => (
                <td
                  key={key + "tabel-fields"}
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  {fields?.[key]}
                </td>
              ))}
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Actions
              </td>
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
                    {key === "image" ? (
                      <Image
                        alt={key}
                        width={40}
                        height={40}
                        src={item?.[key] || "/images/unkown.jpeg"}
                        className="aspect-square object-cover rounded-full border border-gray-200 overflow-hidden"
                      />
                    ) : (
                      item?.[key]
                    )}
                  </td>
                ))}
                <td className=" px-4 py-2">
                  <div>
                    {editForm && (
                      <Modal
                        open={openEdit}
                        setOpen={() => setOpenEdit(!openEdit)}
                        title="Edit"
                      >
                        {React.cloneElement(editForm, { itemToEdit: item })}
                      </Modal>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
