"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Spinner from "@/components/shared/spinner";

type Props = {};

const ForgotPasswordMain = ({}: Props) => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Your Email address
            </label>
            <input
              required
              id="password"
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {isEmailSent && (
            <p className="text-start text-sm text-gray-500">
              If the email exists in our system, you will receive a password
              reset link shortly.
            </p>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="transition w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center"
          >
            {isLoading ? <Spinner /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordMain;
