"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import Spinner from "../shared/spinner";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../button";

export default function SignWith({
  setSection,
}: {
  setSection: (section: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const t = useTranslations();

  const sharedClasses =
    " p-4 transition w-full flex items-center gap-x-5 w-full bg-gray-100 border-gray-200 border rounded-md text-nowrap";

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
      <section className="flex flex-col gap-4">
        <label
          htmlFor="UserEmail"
          className="relative block overflow-hidden rounded-md border border-gray-300/50 px-4 pt-4 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 bg-gray-100"
        >
          <input
            type="email"
            value={email}
            id="UserEmail"
            placeholder={t("Email")}
            onKeyDown={handleKeyDown}
            onChange={(e) => setEmail(e.target.value)}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm "
          />

          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
            {t("Email")}
          </span>
        </label>
        <label
          htmlFor="UserPassword"
          className="relative block overflow-hidden rounded-md border border-gray-300/50 px-4 pt-4 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 bg-gray-100"
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
        <div className="flex gap-4 items-center justify-center transition">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className={"google-btn " + sharedClasses}
          >
            <FcGoogle size={25} /> {t("Sign in with Google")}
          </button>
          {/* <button
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            className={"text-blue-700   " + sharedClasses}
          >
            <FaFacebook size={25} /> {t("Sign in with Facebook")}
          </button> */}
        </div>
        <div className="flex justify-between items-center my-5">
          <label
            htmlFor="Option1"
            className="flex cursor-pointer items-start gap-4 rounded-lg transition"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id="Option1" // Associate this id with the label's htmlFor attribute
                className="size-5 rounded bg-black"
              />
            </div>

            <div>
              <span className="text-gray-600">{t("Remember me")}</span>
            </div>
          </label>

          <button
            onClick={() => setSection("forget-password")}
            className="text-orange-900 hover:text-blue-800"
          >
            {t("Forgot password?")}
          </button>
        </div>
        <p
          className={`text-red-600 h-5 mb-3 mt-6 ${
            error ? "opacity-100" : "opacity-0"
          } `}
        >
          {error}
        </p>
      </section>

      <Button
        onClick={handleSignIn}
        isLoading={isLoading}
        className="w-full py-3 font-medium"
      >
        {t("Sign in")}
      </Button>

      <div className="mt-5 flex items-center justify-center">
        <span className="text-gray-600">{t("New here?")}</span>
        <button
          onClick={() => setSection("signup")}
          className="text-primary-500 ms-2 font-medium"
        >
          {t("Create an account")}
        </button>
      </div>
    </div>
  );
}
