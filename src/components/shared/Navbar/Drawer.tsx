"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { BiMenuAltRight } from "react-icons/bi";

export default function Drawer({
  user,
}: Readonly<{
  user: {
    name: string;
    email: string;
    image: string;
    role: string;
  };
}>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (e: any) => {
    if (e.target.closest("#drawer") === null) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return (
    <div id="drawer" className="sm:hidden w-10">
      <BiMenuAltRight
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="h-8 w-8 text-gray-400 group-hover:text-gray-500 m-4 fixed right-0 top-0 z-10"
      />
      <div
        className={` fixed right-0 top-0 h-screen w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="px-4 py-10">
            <ul className="mt-6 space-y-1">
              <li>
                <a
                  href="#"
                  className="block rounded-lg hover:bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  Profile
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  Wish List
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  Cart
                </a>
              </li>
              <li>
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <span className="text-sm font-medium"> Account </span>
                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>
                  <ul className="mt-2 space-y-1 px-4">
                    {user.role === "admin" && (
                      <li>
                        <Link
                          href="/dashboard"
                          className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        onClick={() =>
                          signOut({
                            redirect: true,
                            callbackUrl: "/signin",
                          })
                        }
                        className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
            <a
              href="#"
              className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
            >
              <img
                alt="Man"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "/images/unkown.jpeg";
                }}
                src={user.image}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs">
                  <strong className="block font-medium">{user.name}</strong>
                  <span> {user.email}</span>
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
