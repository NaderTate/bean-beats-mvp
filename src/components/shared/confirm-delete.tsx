import { useState } from "react";

import Modal from "./Modal";
import Spinner from "./spinner";

interface ConfirmDeleteProps {
  deleteFn: () => void;
}

const ConfirmDelete = ({ deleteFn }: ConfirmDeleteProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => setOpen(!open);

  const handleDelete = () => {
    setIsLoading(true);
    deleteFn();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      setOpen={toggleModal}
      title={"Are you sure you want to delete this item?"}
    >
      <div className="flex justify-between">
        <button
          onClick={handleDelete}
          className="mt-5 inline-block w-full rounded-lg px-5 py-3 font-medium text-white sm:w-auto bg-primary hover:bg-primary-500 transition"
        >
          {isLoading ? <Spinner /> : "Delete"}
        </button>
        <button
          onClick={toggleModal}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDelete;
