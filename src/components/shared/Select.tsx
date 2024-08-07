import React, { forwardRef, SelectHTMLAttributes } from "react";

type Option = {
  value: string;
  title: string;
};

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label: string;
}

const Select = forwardRef<HTMLSelectElement, Props>(({ options, label, ...props }, ref) => {
  return (
    <div>
      <label className="sr-only" htmlFor={props.id || props.name}>
        {label}
      </label>
      <select
        ref={ref}
        title={label}
        className="p-3 bg-white block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
});

Select.displayName = "Select";

export default Select;
