import { NextPage } from "next";
import ForgotPasswordMain from "./main";

type ForgotPasswordProps = {};

const ForgotPassword: NextPage = async ({}: ForgotPasswordProps) => {
  return (
    <>
      <ForgotPasswordMain />
    </>
  );
};

export default ForgotPassword;
