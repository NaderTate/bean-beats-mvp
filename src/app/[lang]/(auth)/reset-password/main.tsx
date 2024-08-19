"use client";

import { updateUserPassword } from "@/actions/users";
import Spinner from "@/components/shared/spinner";
import useGetLang from "@/hooks/use-get-lang";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const ResetPasswordMain = (props: Props) => {
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userId = searchParams.get("userid");
  const { lang } = useGetLang();
  const { push } = useRouter();
  if (!userId) {
    return <div>User not found</div>;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await updateUserPassword({ userId, password });
    toast.success("Password updated successfully");
    push(`/${lang}/signin`);
    setIsLoading(false);
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
              Password
            </label>
            <input
              required
              id="password"
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !password}
            className="transition w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center"
          >
            {isLoading ? <Spinner /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordMain;
