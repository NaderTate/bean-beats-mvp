"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import Modal from "./Modal";

import {
  FcNext,
  FcShop,
  FcMusic,
  FcBarChart,
  FcMoneyTransfer,
  FcConferenceCall,
} from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc";
import { HiOutlineLogout } from "react-icons/hi";

import useGetLang from "@/hooks/use-get-lang";
import LanguageToggle from "../language-toggle";
import ProfileForm from "./Forms/profile";
import { User } from "@prisma/client";

const links = [
  {
    title: "Dashboard",
    icon: FcBarChart,
    href: "/dashboard",
  },
  {
    title: "Users",
    icon: FcConferenceCall,
    href: "/dashboard/users",
  },
  {
    title: "music",
    icon: FcMusic,
    href: "/dashboard/music",
  },
  {
    title: "Transactions",
    icon: FcMoneyTransfer,
    href: "/dashboard/transactions",
  },
  {
    title: "Shops",
    icon: FcShop,
    href: "/dashboard/shops",
  },
];

export default function Dashboard({ user }: { user: User }) {
  const { push } = useRouter();
  const { lang } = useGetLang();
  const pathname = usePathname();

  const t = useTranslations();
  const [isOpened, setIsOpened] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div
        className={` transition-all duration-300 ${
          isOpened ? "w-16" : "w-0 opacity-0 -translate-x-28"
        }`}
      ></div>
      <div
        className={` fixed top-0 start-0 flex h-screen flex-col justify-between border-e bg-white transition-all duration-300 ${
          isOpened ? "w-16" : "w-0 opacity-0 -translate-x-28"
        }`}
      >
        {/* Top Section */}
        <div>
          <div className="border-t border-gray-100">
            <div className="px-2">
              <ul className="space-y-1 sm:space-y-5 border-gray-100 pt-4 flex flex-col items-center">
                {links.map((link) => (
                  <li key={link.href + "dashboardLink"}>
                    <Link
                      href={`/${lang}${link.href}`}
                      className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${
                        pathname === link.href && "bg-blue-100/60"
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
                  <LanguageToggle />
                </div>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mb-20">
          <ul className="space-y-1 sm:space-y-5 flex flex-col items-center">
            <li>
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <FcBusinessman className="h-5 w-5 opacity-75" />
                <span className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white -translate-x-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                  {t("Profile")}
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/signin" });
                  push("/signin");
                }}
                className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <HiOutlineLogout className="h-5 w-5 opacity-75 text-primary" />
                <span className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white -translate-x-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                  {t("Logout")}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Toggle Button */}
      <div
        className={`fixed bottom-[20px] start-0  w-12 rounded-r-full bg-gray-100/70`}
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
      <Modal open={isModalOpen} title="Edit profile" setOpen={toggleModal}>
        <ProfileForm itemToEdit={user} onSubmit={toggleModal} />
      </Modal>
    </>
  );
}
