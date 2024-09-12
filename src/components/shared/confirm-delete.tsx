import { useState } from "react";

import Modal from "./Modal";
import Spinner from "./spinner";

import { MdDeleteForever } from "react-icons/md";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface ConfirmDeleteProps {
  deleteFn: () => Promise<void>;
}

const ConfirmDelete = ({ deleteFn }: ConfirmDeleteProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();

  const toggleModal = () => setOpen(!open);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteFn();
    toast.success(t("Item deleted successfully"));
    setOpen(false);
  };

  return (
    <div>
      <MdDeleteForever
        size={20}
        onClick={toggleModal}
        className="text-red-600 cursor-pointer"
      />
      <Modal
        open={open}
        setOpen={toggleModal}
        title={t("Are you sure you want to delete this item?")}
      >
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="inline-block rounded-lg px-5 py-3 font-medium text-white bg-primary hover:bg-primary-500 transition"
          >
            {isLoading ? <Spinner /> : t("Delete")}
          </button>
          <button
            onClick={toggleModal}
            className="bg-gray-300 text-gray-700 px-5 py-3 rounded-lg"
          >
            {t("Cancel")}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmDelete;
