import { useState } from "react";

import Modal from "./Modal";
import Spinner from "./spinner";

import { MdDeleteForever } from "react-icons/md";

interface ConfirmDeleteProps {
  deleteFn: () => Promise<void>;
}

const ConfirmDelete = ({ deleteFn }: ConfirmDeleteProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => setOpen(!open);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteFn();
    setOpen(false);
  };

  return (
    <>
      <MdDeleteForever
        size={20}
        onClick={toggleModal}
        className="text-red-600 cursor-pointer"
      />
      <Modal
        open={open}
        setOpen={toggleModal}
        title={"Are you sure you want to delete this item?"}
      >
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="inline-block rounded-lg px-5 py-3 font-medium text-white bg-primary hover:bg-primary-500 transition"
          >
            {isLoading ? <Spinner /> : "Delete"}
          </button>
          <button
            onClick={toggleModal}
            className="bg-gray-300 text-gray-700 px-5 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmDelete;
