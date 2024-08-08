"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SignIn from "@/components/auth/sign-in";
import { motion, AnimatePresence } from "framer-motion";

import Drawer from "./Drawer";
import DropDown from "./DropDown";

import { FiShoppingCart } from "react-icons/fi";
import { useSongsCart } from "@/store/songs-cart";

const Navbar = () => {
  const pathname = usePathname();
  const shopId = pathname.split("/")[2];
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

  if (pathname === "/signin") {
    return null;
  }
  const navItems = [
    { link: "/payment", name: "Payment" },
    { link: "/queue", name: "Queue" },
    { link: "/music", name: "Music" },
  ];
  return (
    <nav
      style={{ top: visible ? "0" : "-100px", transition: "top 0.6s" }}
      className="flex items-center justify-between text-gray-600 right-0 fixed w-full shadow-sm dark:shadow-slate-800 z-10 bg-white/90 dark:bg-gray-900 h-16"
    >
      <div className="py-2 sm:py-1 px-2 sm:p-8 flex items-center gap-x-5">
        <Link
          href={`/shop/${shopId}`}
          className="flex items-end justify-center "
        >
          <Image
            className="hidden  sm:block w-14"
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
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={`${shopId ? `/shop/${shopId}` : ""}${item.link}`}
            className={`hidden sm:flex items-center justify-center gap-2 font-semibold ${
              pathname.includes(item.link) ? "text-primary" : "text-gray-600"
            } hover:text-gray-800`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="inline-flex">
        <div className="relative p-3 m-3">
          <Link
            href={`/shop/${shopId}/payment`}
            className="flex items-center gap-2"
          >
            <FiShoppingCart size={20} />
            <span className="text-sm absolute right-0 bottom-0 bg-gray-200 rounded-full aspect-square w-4 h-4 flex items-center justify-center font-semibold">
              {songs.length}
            </span>
          </Link>
        </div>
        <AnimatePresence mode="wait">
          {session?.user && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="flex items-center gap-4 justify-between pr-2 sm:pr-12 lg:px-4 col-span-2"
            >
              {session?.user ? (
                <>
                  <div className="group hidden sm:flex shrink-0 items-center rounded-lg transition ">
                    <span className="sr-only">Menu</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Profile"
                      src={
                        session.user?.image as string | "/images/unkown.jpeg"
                      }
                      className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = "/images/unkown.jpeg";
                      }}
                    />
                    <DropDown user={session.user as any} />
                  </div>
                </>
              ) : (
                <SignIn />
              )}
            </motion.div>
          )}
          <Drawer
            user={session?.user as any}
            navItems={navItems}
            shopId={shopId}
          />
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
