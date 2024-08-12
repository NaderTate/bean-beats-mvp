"use client";

import ar from "../dictionaries/ar.json";
import en from "../dictionaries/en.json";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const translations: any = {
  ar,
  en,
};

const useTranslation = () => {
  const pathname = usePathname();

  const lang = useMemo(() => {
    const lang = pathname.split("/")[1];
    return lang === "en" || lang === "ar" ? lang : "ar";
  }, [pathname]);

  const t = useMemo(() => {
    const currentTranslations = translations[lang] || translations.en;

    return (key: string) => currentTranslations[key] || key;
  }, [lang]);

  return { t, lang };
};

export default useTranslation;
