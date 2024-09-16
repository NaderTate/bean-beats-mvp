"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import useGetLang from "@/hooks/use-get-lang";
import SignInWith from "@/components/auth/sign-in";
import NewPasswordForm from "@/components/auth/new-password";
import ForgotPasswordForm from "@/components/auth/forget-password";
import { useState } from "react";
import LanguageToggle from "@/components/language-toggle";
import CreateAccount from "@/components/auth/create-account";
import { FaChevronLeft } from "react-icons/fa";
type section = "login" | "forget-password" | "create-new-password" | "signup";

export default function Main() {
  const t = useTranslations();
  const { lang } = useGetLang();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userid");
  const section: section = (searchParams.get("section") as section) || "login";

  const [currentSection, setCurrentSection] = useState<section>(section);

  return (
    <section className="dark:bg-gray-900 lg:h-screen overflow-hidden relative">
      {/* Logo Link with dynamic positioning */}
      <div
        className={`z-20 inline-flex items-center justify-center rounded-full bg-white text-blue-600 dark:bg-gray-900  absolute top-4 ${
          lang === "ar" ? "left-4" : "right-4"
        }`}
      >
        <LanguageToggle />
        <Link href="/">
          <Image src="/images/Logo.png" alt="icon" width={80} height={80} />
        </Link>
      </div>
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12 gap-10 relative">
        <section className="relative lg:flex flex-col hidden lg:h-full lg:col-span-6">
          <Image
            alt="Night"
            quality={80}
            layout="fill"
            objectFit="cover"
            src="/images/caffee.webp"
            className={`absolute inset-0 h-full w-full opacity-80 z-0 ${
              lang === "ar" ? "rounded-l-[70px]" : "rounded-r-[70px]"
            }`}
          />
          {/* Overlay gradient for shadow effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#341E0C]/80 to-transparent z-10 ${
              lang === "ar" ? "rounded-l-[70px]" : "rounded-r-[70px]"
            }`}
          ></div>

          {/* Text container positioned at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 lg:block">
            <h2 className="text-2xl font-bold text-[#CF8748] sm:text-3xl md:text-4xl">
              {t("Music and Coffee")}
            </h2>
            <p className="mt-2 leading-relaxed text-white text-lg">
              {t(
                "Bean Beats is a platform that combines the love of music and coffee"
              )}
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-1 sm:px-8 py-8 lg:py-12 lg:col-span-6 relative max-h-screen overflow-auto ">
          <div className="w-full px-3 sm:px-8 relative">
            <div className="max-w-lg mx-auto relative flex flex-col-reverse sm:flex-col gap-5 mt-10">
              {currentSection === "login" && (
                <>
                  <h2 className="text-xl text-center font-bold sm:text-2xl md:text-3xl">
                    {t("Welcome back to Bean Beats")}
                  </h2>
                  <SignInWith
                    setSection={(section) =>
                      setCurrentSection(section as section)
                    }
                  />
                </>
              )}

              {currentSection === "forget-password" && (
                <>
                  <FaChevronLeft
                    onClick={() => setCurrentSection("login")}
                    className="text-primary-500 cursor-pointer"
                    size={25}
                  />
                  <ForgotPasswordForm />
                </>
              )}
              {currentSection === "signup" && (
                <CreateAccount
                  onSubmit={() => {
                    setCurrentSection("login");
                  }}
                />
              )}
              {currentSection === "create-new-password" && (
                <NewPasswordForm
                  setSection={(section) =>
                    setCurrentSection(section as section)
                  }
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
