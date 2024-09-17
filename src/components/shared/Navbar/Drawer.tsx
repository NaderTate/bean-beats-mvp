"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { navData } from "@/app/[lang]/(public)/navbar/nav-data";

import { BiMenuAltLeft } from "react-icons/bi";
import LanguageToggle from "@/components/language-toggle";
import useGetLang from "@/hooks/use-get-lang";
import { usePathname } from "next/navigation";

export default function Drawer({
  user,
  navItems,
  shopId,
}: Readonly<{
  user: {
    name: string;
    email: string;
    image: string;
    role: string;
  } | null;
  navItems: typeof navData;
  shopId: string;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (e: any) => {
    if (e.target.closest("#drawer") === null) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const t = useTranslations();
  const { lang } = useGetLang();
  const pathname = usePathname();
  return (
    <div id="drawer" className="sm:hidden w-10">
      <BiMenuAltLeft
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`text-black h-8 w-8 group-hover:text-gray-500 m-4 fixed ${
          lang === "ar" ? "right-0" : "left-0"
        } top-0 z-10 cursor-pointer`}
      />
      <div
        className={` fixed ${
          lang === "ar" ? "right-0" : "left-0"
        } top-0 h-screen w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : lang === "ar"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="px-4 py-10">
            <ul className="mt-6 space-y-2">
              {navData.map((item) => {
                const href = `/${lang}/shop/${shopId}${
                  item.link ? `/${item.link}` : ""
                }`;

                return (
                  <Link
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    key={item.name}
                    href={href}
                    className={`my-5 block transition items-center justify-center gap-2 font-semibold ${
                      pathname === href ? "text-primary" : "text-gray-600"
                    } hover:text-gray-800`}
                  >
                    <div className="flex items-center gap-x-3">
                      <item.icon />
                      {t(item.name)}
                    </div>
                  </Link>
                );
              })}
              <li>
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <span className="text-sm font-medium"> Account </span>
                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>
                  <ul className="mt-2 space-y-1 px-4">
                    <li>
                      <button
                        type="button"
                        onClick={() =>
                          signOut({
                            redirect: true,
                            callbackUrl: "/signin",
                          })
                        }
                        className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                      >
                        {t("Logout")}
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
            <LanguageToggle />
          </div>
          {user && (
            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
              <a
                href="#"
                className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
              >
                <img
                  alt="Man"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = "/images/unkown.jpeg";
                  }}
                  src={user.image}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs">
                    <strong className="block font-medium">{user.name}</strong>
                    <span> {user.email}</span>
                  </p>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
