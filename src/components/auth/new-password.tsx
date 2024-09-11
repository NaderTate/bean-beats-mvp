"use client";

import { updateUserPassword } from "@/actions/users";
import Spinner from "@/components/shared/spinner";
import useGetLang from "@/hooks/use-get-lang";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const NewPasswordForm = ({}: Props) => {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userId = searchParams.get("userid");
  const { lang } = useGetLang();
  const { push } = useRouter();

  if (!userId) {
    return <div>User not found</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error(t("Passwords do not match"));
      return;
    }

    setIsLoading(true);

    try {
      await updateUserPassword({ userId, password });
      toast.success(t("Password updated successfully"));
      push(`/${lang}/signin`);
    } catch (error) {
      toast.error(t("Error updating password"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6">Create new Password</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            required
            type="password"
            value={password}
            id="new-password"
            name="New Password"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <input
            required
            type="password"
            id="confirm-password"
            name="Confirm Password"
            value={confirmPassword}
            placeholder="Confirm New Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className="transition w-full bg-primary-900 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center"
        >
          {isLoading ? <Spinner /> : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
