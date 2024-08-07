import { redirect } from "next/navigation";

export default function Home() {
  redirect("/coffee-shop/dashboard");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <h1 className="text-4xl font-bold">Next.js</h1> */}
      {/* <UploadImage />
      <SignIn /> */}
    </main>
  );
}
