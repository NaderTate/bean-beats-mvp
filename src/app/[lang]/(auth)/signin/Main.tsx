"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SignInWith from "@/components/auth/sign-in";

export default function Main() {
  return (
    <section className=" bg-orange-900/10 dark:bg-gray-900 lg:h-screen overflow-hidden">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-56  flex-col  lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Night"
            src="/images/Background.png"
            className="absolute inset-0 h-full w-full object-cover opacity-80 z-0"
          />
          <Link
            className="hidden lg:flex items-center flex-1 justify-center"
            href="/"
          >
            <span className="sr-only">Home</span>
            <Image
              src="/images/Logo.png"
              className="translate-y-16"
              alt="icon"
              width={300}
              height={300}
            />
          </Link>
          <div className="hidden lg:relative lg:block lg:p-12 bg-slate-100/25 backdrop-blur-sm">
            <h2 className="mt-6 text-2xl font-bold text-orange-950 dark:text-white sm:text-3xl md:text-4xl">
              Music and Coffee
            </h2>
            <p className="mt-4 leading-relaxed text-orange-950/80 dark:text-white/90 text-lg">
              Bean Beats is a platform that combines the love of music and
              coffee.
            </p>
          </div>
        </section>
        <main className="flex items-center justify-center px-1 sm:px-8 py-8 lg:col-span-7 lg:py-12 xl:col-span-6">
          <div className="w-full px-3 sm:px-8">
            <div className="relative -mt-16 block lg:hidden">
              <Link
                className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 dark:bg-gray-900 sm:h-20 sm:w-20"
                href="/"
              >
                <span className="sr-only">Home</span>
                <Image
                  src="/images/Logo.png"
                  alt="icon"
                  width={80}
                  height={80}
                />
              </Link>
              <h2 className="mt-6 text-2xl font-bold text-orange-950 dark:text-white sm:text-3xl md:text-4xl">
                Music and Coffee
              </h2>
              <p className="mt-4 leading-relaxed text-orange-950/80 dark:text-white/90 text-lg">
                {" "}
                Bean Beats is a platform that combines the love of music and
                coffee.
              </p>
            </div>
            <div className="relative flex flex-col-reverse sm:flex-col gap-5 mt-10">
              <div className="absolute w-[140%] h-[140%] bg-slate-100/10 -top-10 -right-10 -z-[1] hidden sm:block"></div>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
                  Welcome back to Bean Beats
                </h2>
                <p className=" leading-relaxed text-gray-500 dark:text-gray-400 text-sm sm:text-lg">
                  Elevate your Coffee Experience with Bean Sounds.
                </p>
              </div>
              <SignInWith />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
