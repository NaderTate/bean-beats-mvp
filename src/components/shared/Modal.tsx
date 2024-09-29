import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";

export default function Modal({
  children,
  open,
  setOpen,
  title,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: () => void;
  title?: string;
}) {
  const t = useTranslations();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50"
              onClick={handleBackgroundClick}
            >
              <div
                className="relative p-4 w-full max-w-2xl max-h-full"
                onClick={handleContentClick}
              >
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {t(title)}
                    </h3>

                    <IoClose
                      onClick={() => setOpen()}
                      className="text-gray-500 w-8 h-8 rounded-xl cursor-pointer hover:bg-gray-200 hover:text-gray-900 p-1 justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    />
                  </div>
                  {/* Modal body */}
                  <div className="p-4 md:p-5 space-y-4 overflow-auto max-h-[78vh]">
                    {children}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
