import useGetLang from "@/hooks/use-get-lang";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { CiGlobe } from "react-icons/ci";

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
      <CiGlobe size={25} />
    </button>
  );
};

export default LanguageToggle;
