import { useTranslations } from "next-intl";
import { ChangeEvent, forwardRef, HTMLInputTypeAttribute } from "react";

type Props = {
  id?: string;
  step?: number;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  min?: number | string;
  value?: string | number;
  defaultValue?: string | number;
  type?: HTMLInputTypeAttribute | undefined;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  errMessage?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, id, errMessage, ...props }, ref) => {
    const t = useTranslations();
    return (
      <div>
        {label && <label htmlFor={id}>{t(label)}</label>}
        <input
          ref={ref}
          {...props}
          placeholder={t(props.placeholder)}
          className="w-full rounded-lg border-gray-200 p-3 text-sm focus:outline-none focus:border-primary/50 border  dark:border-gray-600 dark:placeholder-gray-400 dark:bg-gray-700 dark:text-gray-400"
        />
        {errMessage && (
          <span className="text-red-500 text-sm">{errMessage}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
