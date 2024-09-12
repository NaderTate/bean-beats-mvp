"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Add the necessary icons
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputFieldProps = {
  id?: string;
  label: string;
  placeholder?: string;
  className?: string;
  errMessage?: string;
  as?: "input" | "textarea"; // New prop to determine if the component should be an input or textarea
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input: React.FC<InputFieldProps> = ({
  id,
  label,
  placeholder = "",
  className,
  errMessage,
  as = "input", // Default to input if not specified
  type = "text", // Default to text input
  ...rest
}) => {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const Component = as === "textarea" ? "textarea" : "input"; // Conditionally select the component

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle the visibility state
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={clsx(
          "relative block overflow-hidden rounded-md border px-4 pt-4 shadow-sm focus-within:ring-1",
          className
        )}
      >
        <Component
          id={id}
          {...rest}
          type={type === "password" && showPassword ? "text" : type} // Change input type based on showPassword state
          placeholder={placeholder}
          className={clsx(
            "peer w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm",
            as === "textarea" ? "h-20 resize-none" : "h-8" // Adjust height for textarea
          )}
        />

        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
          {t(label)}
        </span>

        {/* Conditionally render the password toggle icon */}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 end-3 flex items-center text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </label>

      {errMessage && (
        <p className="mt-1 text-xs text-red-600">{t(errMessage)}</p>
      )}
    </div>
  );
};

export default Input;
