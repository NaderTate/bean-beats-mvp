"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Spinner from "@/components/shared/spinner";

type Props = {};

const ForgotPasswordForm = ({}: Props) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success("Password reset link sent successfully");
    setIsLoading(false);
    setIsEmailSent(true);
  };
  return (
    <form className="space-y-4">
      <h2 className="text-2xl font-semibold">Forget Password</h2>
      <h4 className="text-[#989898] font-medium">
        Don&apos;t worry! It occurs. Please enter the email address linked with
        your account.
      </h4>
      <div>
        <input
          required
          id="password"
          type="email"
          name="email"
          value={email}
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      {isEmailSent && (
        <p className="text-start text-sm text-gray-500">
          If the email exists in our system, you will receive a password reset
          link shortly.
        </p>
      )}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isLoading || !email}
        className="transition w-full bg-[#341E0C] text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center"
      >
        {isLoading ? <Spinner /> : "Reset Password"}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
