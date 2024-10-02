import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import React, { forwardRef, useState, useRef, useEffect } from "react";

import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";
import useGetLang from "@/hooks/use-get-lang";

type Option = {
  value: string;
  title: string;
};

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label: string;
  errMessage?: string;
  enableSearch?: boolean;
  width?: "full" | "fit";
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
      width = "full",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectWidth, setSelectWidth] = useState<number | undefined>(
      undefined
    );
    const dropdownRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const t = useTranslations();
    const { lang } = useGetLang();

    const isRTL = lang === "ar";

    useEffect(() => {
      setSelectedValue(value || "");
    }, [value]);

    useEffect(() => {
      const measureWidth = () => {
        if (measureRef.current) {
          let maxWidth = 0;
          options.forEach((option) => {
            measureRef.current!.textContent = t(option.title);
            const optionWidth = measureRef.current!.offsetWidth;
            if (optionWidth > maxWidth) {
              maxWidth = optionWidth;
            }
          });
          // Add some padding
          setSelectWidth(maxWidth + 40); // 40px for padding and arrow
        }
      };

      measureWidth();
    }, [options, t]);

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

    const containerStyle =
      width === "fit" && selectWidth ? { width: `${selectWidth}px` } : {};

    return (
      <div
        ref={dropdownRef}
        className={`${isRTL ? "rtl" : "ltr"} flex-shrink-0 ${
          width === "full" ? "w-full" : ""
        }`}
        style={containerStyle}
      >
        <label
          htmlFor={props.id || props.name}
          className={`block mb-2 ${isRTL ? "text-right" : ""}`}
        >
          {t(label)}
        </label>
        <div className="relative w-full">
          <button
            type="button"
            onClick={toggleDropdown}
            className={`p-3 bg-white block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:placeholder-gray-400 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="truncate">
                {selectedOption
                  ? t(selectedOption.title)
                  : t("Select") + " " + t(label)}
              </span>
              <motion.div
                className={`${isRTL ? "me-2" : "ms-2"} flex-shrink-0`}
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
                        className={`w-full p-2 ${
                          isRTL ? "pr-8 text-right" : "pl-8"
                        } text-sm border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200`}
                      />
                      <IoSearch
                        className={`absolute ${
                          isRTL ? "right-3" : "left-3"
                        } top-1/2 transform -translate-y-1/2 text-gray-400`}
                      />
                    </div>
                  </div>
                )}
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionChange(option.value)}
                      className={`block w-full px-4 py-2 text-sm ${
                        isRTL ? "text-right" : "text-left"
                      } text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white`}
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
          <span
            className={`text-red-500 text-sm mt-1 ${
              isRTL ? "block text-right" : ""
            }`}
          >
            {t(errMessage)}
          </span>
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
        <span
          ref={measureRef}
          className="absolute opacity-0 pointer-events-none whitespace-nowrap"
        />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
