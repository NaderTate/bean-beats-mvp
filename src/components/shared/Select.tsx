import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import React, { forwardRef, useState, useRef, useEffect } from "react";

import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";

type Option = {
  value: string;
  title: string;
};

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label: string;
  errMessage?: string;
  enableSearch?: boolean;
}

const Select = forwardRef<HTMLSelectElement, Props>(
  (
    {
      options,
      label,
      errMessage,
      value,
      onChange,
      enableSearch = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();

    useEffect(() => {
      setSelectedValue(value || "");
    }, [value]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionChange = (newValue: string) => {
      setSelectedValue(newValue);
      setIsOpen(false);
      setSearchTerm("");
      if (onChange) {
        const event = {
          target: { value: newValue },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const filteredOptions = options.filter((option) =>
      t(option.title).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div ref={dropdownRef}>
        <label htmlFor={props.id || props.name}>{t(label)}</label>
        <div className="relative">
          <button
            type="button"
            onClick={toggleDropdown}
            className="p-3 bg-white block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:placeholder-gray-400"
          >
            <div className="flex items-center justify-between">
              <span>
                {selectedOption
                  ? t(selectedOption.title)
                  : t("Select") + " " + t(label)}
              </span>
              <motion.div
                className="ms-2"
                transition={{ duration: 0.2 }}
                animate={{ rotate: isOpen ? 180 : 0 }}
              >
                <FaChevronDown />
              </motion.div>
            </div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-700 dark:border-gray-600 overflow-hidden"
              >
                {enableSearch && (
                  <div className="p-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("Search")}
                        className="w-full p-2 pl-8 text-sm border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                      />
                      <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                )}
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionChange(option.value)}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {t(option.title)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {errMessage && (
          <span className="text-red-500 text-sm">{t(errMessage)}</span>
        )}
        <select
          ref={ref}
          {...props}
          value={selectedValue}
          onChange={(e) => handleOptionChange(e.target.value)}
          className="hidden"
        >
          <option value="">
            {t("Select")} {t(label)}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.title)}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
