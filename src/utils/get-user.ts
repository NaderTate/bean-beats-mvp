import { auth } from "@/utils/auth";

export const getUser = async () => {
  try {
    const session = await auth();
    return session?.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
