"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { BiErrorAlt } from "react-icons/bi";
import { RiErrorWarningFill } from "react-icons/ri";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className=" h-screen flex flex-col gap-5 justify-center items-center ">
      <h2 className="text-3xl inline-flex items-center gap-2 font-bold">
        Something went wrong
        <RiErrorWarningFill className="fill-primary" />
      </h2>
      <button onClick={reset} className="bg-primary w-80 text-white px-4 py-2 ">
        Try again
      </button>
    </div>
  );
}
