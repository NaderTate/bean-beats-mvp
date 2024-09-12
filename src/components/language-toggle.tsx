import useGetLang from "@/hooks/use-get-lang";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {};

const LanguageToggle = (props: Props) => {
  const pathname = usePathname();
  const { lang } = useGetLang();
  const { push } = useRouter();

  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          const newPath = pathname.replace(lang, lang === "en" ? "ar" : "en");
          push(newPath, { scroll: false });
        });
      }}
      className="w-fit group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    >
      {lang === "en" ? "AR" : "EN"}
      <span className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white -translate-x-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
        {lang === "en" ? "عربي" : "English"}
      </span>
    </button>
  );
};

export default LanguageToggle;
