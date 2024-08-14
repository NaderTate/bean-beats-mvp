"use client";

import { usePathname } from "next/navigation";

export default function useGetLang() {
  const pathname = usePathname();

  const lang: Lang = (pathname.split("/")[1] as Lang) || "en";

  return { lang };
}
