"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SignInWith from "@/components/auth/sign-in";
import { useTranslations } from "next-intl";
import useGetLang from "@/hooks/use-get-lang";

export default function Main() {
  const t = useTranslations();
  const { lang } = useGetLang();
  return (
    <section className="dark:bg-gray-900 lg:h-screen overflow-hidden relative">
      {/* Logo Link with dynamic positioning */}
      <Link
        className={`inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 dark:bg-gray-900 sm:h-20 sm:w-20 absolute top-4 ${
          lang === "ar" ? "left-4" : "right-4"
        }`}
        href="/"
      >
        <span className="sr-only">Home</span>
        <Image src="/images/Logo.png" alt="icon" width={80} height={80} />
      </Link>
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

        <main className="flex items-center justify-center px-1 sm:px-8 py-8 lg:py-12 lg:col-span-6 relative">
          <div className="w-full px-3 sm:px-8 relative">
            <div className="max-w-lg mx-auto relative flex flex-col-reverse sm:flex-col gap-5 mt-10">
              <div className="absolute w-[140%] h-[140%] bg-slate-100/10 -top-10 -right-10 -z-[1] hidden sm:block"></div>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl text-center font-bold sm:text-2xl md:text-3xl">
                  {t("Welcome back to Bean Beats")}
                </h2>
              </div>
              <SignInWith />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
