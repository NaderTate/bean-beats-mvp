"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };
  const t = useTranslations();

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleToggle}
        />
        <motion.div
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
            isChecked
              ? "bg-blue-500 border-blue-600"
              : "bg-gray-200 border-gray-300"
          }`}
          animate={{
            backgroundColor: isChecked ? "#3B82F6" : "#E5E7EB",
            borderColor: isChecked ? "#2563EB" : "#D1D5DB",
          }}
          transition={{ duration: 0.2 }}
        >
          {isChecked && (
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-white"
            >
              <motion.path
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, strokeDashoffset: 0 }}
                exit={{ pathLength: 0, strokeDashoffset: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.svg>
          )}
        </motion.div>
      </div>
      {label && <span className="ms-2 text-gray-700">{t(label)}</span>}
    </label>
  );
};

export default Checkbox;
