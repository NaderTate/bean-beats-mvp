import { NextPage } from "next";
import ResetPasswordMain from "./main";

type ResetPasswordProps = {};

const ResetPassword: NextPage = async ({}: ResetPasswordProps) => {
  return (
    <>
      <ResetPasswordMain />
    </>
  );
};

export default ResetPassword;
