"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import Drawer from "@/components/shared/Navbar/Drawer";
import DropDown from "@/components/shared/Navbar/DropDown";
import SignIn from "@/components/auth/sign-in";

import { FiShoppingCart } from "react-icons/fi";

import useGetLang from "@/hooks/use-get-lang";
import { useSongsCart } from "@/store/songs-cart";
import { navData } from "./nav-data";
import Tooltip from "@/components/tooltip";
import LanguageToggle from "@/components/language-toggle";

const Navbar = () => {
  const pathname = usePathname();
  const shopId = pathname.split("/")[3];
  const { data: session } = useSession();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const { songs, setSongs } = useSongsCart();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    if (pathname.includes("/dashboard")) return;
    // find current scroll position
    const currentScrollPos = window.pageYOffset;

    // set state based on location info (explained in more detail below)
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setIsScrolled(currentScrollPos > 10);

    // set state to new scroll position
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    const storedSongs = localStorage.getItem("songs");
    if (storedSongs) {
      setSongs(JSON.parse(storedSongs || "[]"));
    }
  }, [setSongs]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, isScrolled, handleScroll]);

  const t = useTranslations();
  const { lang } = useGetLang();
  if (pathname === "/signin") {
    return null;
  }

  return (
    <nav
      style={{ top: visible ? "0" : "-100px", transition: "top 0.6s" }}
      className="flex items-center justify-between text-gray-600 fixed w-full shadow-sm dark:shadow-slate-800 z-10 bg-white/90 dark:bg-gray-900 h-16"
    >
      {/* Left side content */}
      <div className="flex items-center">
        {/* Mobile menu (Drawer), visible only on mobile */}
        <div className="p-2 sm:hidden">
          <Drawer
            user={session?.user as any}
            navItems={navData}
            shopId={shopId}
          />
        </div>

        {/* Logo and nav links, visible only on desktop */}
        <div className="hidden sm:flex items-center">
          <Link
            href={`/shop/${shopId}`}
            className="flex items-end justify-center"
          >
            <Image
              className="w-14"
              src="/images/only-logo.png"
              width={150}
              height={150}
              alt="logo"
            />
            <Image
              className="p-1 h-12"
              src="/images/logo-title.png"
              width={150}
              height={50}
              alt="logo"
            />
          </Link>
          <div className="flex items-center gap-x-5">
            {navData.map((item) => {
              const href = `/${lang}/shop/${shopId}${
                item.link ? `/${item.link}` : ""
              }`;

              return (
                <Link
                  key={item.name}
                  href={href}
                  className={`transition items-center justify-center gap-2 font-semibold ${
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
            <Tooltip
              label={lang === "en" ? "عربي" : "English"}
              direction="bottom"
            >
              <LanguageToggle />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Centered logo, visible only on mobile */}
      <Link
        href={`/shop/${shopId}`}
        className="flex-grow sm:hidden flex items-center justify-center"
      >
        <Image
          className="p-1 h-12"
          src="/images/logo-title.png"
          width={150}
          height={50}
          alt="logo"
        />
      </Link>

      {/* Right side content */}
      <div className="flex items-center">
        {/* Cart Icon */}
        <div className="relative p-3 m-3">
          <Link
            href={`/${lang}/shop/${shopId}/payment`}
            className="flex items-center gap-2"
          >
            <FiShoppingCart size={20} />
            <span className="text-sm absolute right-0 bottom-0 bg-gray-200 rounded-full aspect-square w-4 h-4 flex items-center justify-center font-semibold">
              {songs.length}
            </span>
          </Link>
        </div>

        {/* User dropdown, visible only on desktop */}
        <AnimatePresence mode="wait">
          {session?.user && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="hidden sm:flex items-center gap-4 pr-2 sm:pr-12 lg:px-4"
            >
              {session?.user ? (
                <>
                  <div className="group hidden sm:flex shrink-0 items-center rounded-lg transition">
                    <span className="sr-only">Menu</span>
                    {/* User Profile Image */}
                    <img
                      alt="Profile"
                      src={
                        (session.user?.image as string) || "/images/unkown.jpeg"
                      }
                      className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                      onError={(e: any) => {
                        e.currentTarget.onerror = null; // Prevents infinite loop
                        e.currentTarget.src = "/images/placeholder-profile.png"; // Valid fallback image
                      }}
                    />
                    <DropDown user={session.user as any} />
                  </div>
                </>
              ) : (
                <SignIn setSection={() => {}} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
