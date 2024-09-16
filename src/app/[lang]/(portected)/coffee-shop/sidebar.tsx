"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { FcNext } from "react-icons/fc";
import { IoPeopleSharp } from "react-icons/io5";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaCreditCard, FaGear, FaMusic } from "react-icons/fa6";

import useGetLang from "@/hooks/use-get-lang";

const links = [
  {
    title: "Dashboard",
    icon: RiDashboardHorizontalFill,
    href: "dashboard",
  },
  {
    title: "Music",
    icon: FaMusic,
    href: "music",
  },
  {
    title: "Payments",
    icon: FaCreditCard,
    href: "payments",
  },
  {
    title: "Settings",
    icon: FaGear,
    href: "settings",
  },
  {
    title: "Employees",
    icon: IoPeopleSharp,
    href: "employees",
  },
];

export default function Sidebar() {
  const [isOpened, setIsOpened] = useState(true);

  const { push } = useRouter();
  const { lang } = useGetLang();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const t = useTranslations();

  return (
    <>
      <div
        className={` transition-all duration-300 ${
          isOpened ? "w-16" : "w-0 opacity-0 -translate-x-28"
        }`}
      ></div>
      <div
        className={`fixed top-0 start-0 flex h-screen flex-col justify-between border-e bg-white  transition-all duration-300 ${
          isOpened ? "w-16" : "w-0 opacity-0 -translate-x-28"
        }`}
      >
        <div>
          <div className="pt-20 border-t border-gray-100">
            <div className="px-2">
              <ul className="space-y-1 sm:space-y-5 pt-4">
                {links.map((link) => (
                  <li key={link.href + "dashboardLink"}>
                    <Link
                      href={`/${lang}/coffee-shop/${link.href}`}
                      className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${
                        pathname.includes(link.href) && "text-primary"
                      }`}
                    >
                      <link.icon className="h-5 w-5 opacity-75" />
                      <span className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white -translate-x-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                        {t(link.title)}
                      </span>
                    </Link>
                  </li>
                ))}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      startTransition(() => {
                        const newPath = pathname.replace(
                          lang,
                          lang === "en" ? "ar" : "en"
                        );
                        push(newPath, { scroll: false });
                      });
                    }}
                    className="w-full group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  >
                    {lang === "en" ? "AR" : "EN"}
                    <span className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white -translate-x-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                      {lang === "en" ? "عربي" : "English"}
                    </span>
                  </button>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-[20px] left-0 w-12 rounded-r-full bg-gray-100/70">
        <button
          onClick={() => setIsOpened(!isOpened)}
          className="w-full h-10 flex justify-center items-center rounded-r-full"
        >
          <FcNext
            className={`h-5 w-5 opacity-75 transition-all duration-300 transform ${
              isOpened ? "-rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </>
  );
}
