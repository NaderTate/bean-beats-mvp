"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function SignWith() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Add error state

  const sharedClasses =
    " p-4 text-2xl lg:text-4xl rounded-full border-2 transition ";
  const handleSignIn = async () => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevent default redirection
        callbackUrl: "/",
      });

      if (result?.error) {
        setError("Invalid email or password"); // Set error message
      } else {
        window.location.href = result?.url as string; // Redirect to the callbackUrl on successful login
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
            id="UserEmail"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
          />

          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
            Email
          </span>
        </label>
        <label
          htmlFor="UserPassword"
          className="relative block overflow-hidden rounded-md border border-gray-300/50 px-4 pt-4 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="password"
            id="UserPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
          />

          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
            Password
          </span>
        </label>
        <div className="flex justify-between items-center my-5">
          <label
            htmlFor="Option1"
            className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 transition"
          >
            <div className="flex items-center">
              &#8203;
              <input
                type="checkbox"
                className="size-5 rounded border-gray-300 bg-black"
              />
            </div>

            <div>
              <span className=" f text-gray-600"> Remember me </span>
            </div>
          </label>
          <button className="text-orange-900 hover:text-blue-800">
            Forgot Password
          </button>
        </div>
        {error && <p className="text-red-600">{error}</p>}{" "}
      </section>
      <p className="text-center mb-4">
        <button
          onClick={handleSignIn}
          className=" bg-slate-500 text-white rounded-md px-5 py-3"
        >
          Sign In
        </button>
      </p>
      <div className="flex gap-4 items-center justify-center p-6 transition">
        <span className=" text-lg lg:text-xl ">Sign in with:</span>
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
