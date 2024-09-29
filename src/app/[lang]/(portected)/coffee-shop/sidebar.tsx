"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { FcNext } from "react-icons/fc";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaCreditCard, FaGear, FaMusic } from "react-icons/fa6";

import useGetLang from "@/hooks/use-get-lang";
import Tooltip from "@/components/tooltip";
import LanguageToggle from "@/components/language-toggle";

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
  // {
  //   title: "Employees",
  //   icon: IoPeopleSharp,
  //   href: "employees",
  // },
];

export default function Sidebar() {
  const [isOpened, setIsOpened] = useState(true);
  const { lang } = useGetLang();
  const pathname = usePathname();

  const t = useTranslations();

  return (
    <>
      <div
        className={` transition-all duration-300 ${
          isOpened ? "w-16" : "w-0 opacity-0 translate-x-28"
        }`}
      ></div>
      <div
        className={`fixed top-0 start-0 flex h-screen flex-col justify-between border-e bg-white transition-all duration-300 ${
          isOpened
            ? "w-16"
            : `w-0 opacity-0 ${
                lang === "en" ? "-translate-x-28" : "translate-x-28"
              }`
        }`}
      >
        {/* Top Section */}
        <div>
          <div className="pt-20 border-t border-gray-100">
            <div className="px-2">
              <ul className="space-y-1 sm:space-y-5 pt-4 flex flex-col items-center z-50">
                {links.map((link) => (
                  <Tooltip
                    label={t(link.title)}
                    direction={lang === "en" ? "right" : "left"}
                    key={link.href + "dashboardLink"}
                  >
                    <li>
                      <Link
                        href={`/${lang}/coffee-shop/${link.href}`}
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${
                          pathname.split("/").at(-1) ===
                            link.href.split("/").at(-1) && "bg-blue-100/60"
                        }`}
                      >
                        <link.icon className="h-5 w-5 opacity-75" />
                      </Link>
                    </li>
                  </Tooltip>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mb-20">
          <ul className="space-y-1 sm:space-y-5 pt-4 flex flex-col items-center">
            <li>
              <Tooltip
                label={lang === "en" ? "عربي" : "English"}
                direction={lang === "en" ? "right" : "left"}
              >
                <LanguageToggle />
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
      {/* Toggle Button */}
      <div
        className={`fixed bottom-[20px] start-0 w-12 rounded-r-full bg-gray-100/70`}
      >
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
