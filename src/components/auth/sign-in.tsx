"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import Spinner from "../shared/spinner";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignWith() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const t = useTranslations();

  const sharedClasses =
    " p-4 text-2xl lg:text-4xl rounded-full border-2 transition ";

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevent default redirection
        callbackUrl: "/",
      });

      if (result?.error) {
        setError(t("Invalid email or password")); // Set error message
      } else {
        window.location.href = result?.url as string; // Redirect to the callbackUrl on successful login
      }
    } catch (err) {
      setError(t("An unexpected error occurred"));
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <div className="mt-5">
      <section className="flex flex-col gap-2 ">
        <label
          htmlFor="UserEmail"
          className="relative block overflow-hidden rounded-md border border-gray-300/50 px-4 pt-4 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="email"
            value={email}
            id="UserEmail"
            placeholder={t("Email")}
            onKeyDown={handleKeyDown}
            onChange={(e) => setEmail(e.target.value)}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
          />

          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
            {t("Email")}
          </span>
        </label>
        <label
          htmlFor="UserPassword"
          className="relative block overflow-hidden rounded-md border border-gray-300/50 px-4 pt-4 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            id="UserPassword"
            onKeyDown={handleKeyDown}
            placeholder={t("Password")}
            onChange={(e) => setPassword(e.target.value)}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
          />

          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
            {t("Password")}
          </span>

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 end-2 pr-3 flex items-center text-gray-600"
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </label>
        <div className="flex justify-between items-center my-5">
          <label
            htmlFor="Option1"
            className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 transition"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id="Option1" // Associate this id with the label's htmlFor attribute
                className="size-5 rounded border-gray-300 bg-black"
              />
            </div>

            <div>
              <span className="text-gray-600">{t("Remember me")}</span>
            </div>
          </label>

          <Link
            href="/forgot-password"
            className="text-orange-900 hover:text-blue-800"
          >
            {t("Forgot password?")}
          </Link>
        </div>
        {error && <p className="text-red-600">{error}</p>}{" "}
      </section>
      <p className="text-center mb-4">
        <button
          onClick={handleSignIn}
          className=" bg-slate-500 text-white rounded-md px-5 py-3"
        >
          {isLoading ? <Spinner /> : t("Sign in")}
        </button>
      </p>
      <div className="flex gap-4 items-center justify-center p-6 transition">
        <span className=" text-lg lg:text-xl ">{t("Sign in with")}:</span>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className={
            " border-red-600 border google-btn hover:bg-red-600" + sharedClasses
          }
        >
          <FcGoogle />
        </button>
        <button
          onClick={() => signIn("facebook", { callbackUrl: "/" })}
          className={
            "text-blue-700 hover:text-white hover:bg-blue-600 border-blue-600" +
            sharedClasses
          }
        >
          <FaFacebook />
        </button>
      </div>
    </div>
  );
}
