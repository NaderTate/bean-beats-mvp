'use client'
import { useState } from 'react'
import Link from 'next/link'
import { GoChevronDown } from 'react-icons/go'
import { signOut } from 'next-auth/react'

export default function DropDown({
  user,
}: Readonly<{
  user: {
    name: string
    email: string
    role: string
  }
}>) {
  const [isOpen, setIsOpen] = useState(false)
  // close the dropdown menu when user clicks outside of it

  const handleClickOutside = (event: any) => {
    if (event.target.closest('#dropDown') === null) {
      setIsOpen(false)
    }
  }

  document.addEventListener('click', handleClickOutside)

  return (
    <div className="relative" id="dropDown">
      <GoChevronDown
        className={`h-5 w-5 text-gray-400 group-hover:text-gray-500 ms-2 transition duration-300 rounded-md hover:bg-gray-100 ${isOpen && 'rotate-180'}`}
        aria-hidden="true"
        onClick={() => setIsOpen(!isOpen)}
      />
      <div
        className={`absolute top-[130%] right-0 mt-2  rounded-md shadow-lg py-1 bg-white ring-black ring-opacity-5 ${isOpen ? 'block' : 'hidden'}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu">
        <ul className="space-y-1">
          <li>
            <p className="text-xs rounded-lg px-4 py-2">
              <strong className="block font-medium">{user.name.split(' ')[0]}</strong>
              <span> {user?.email}</span>
            </p>
          </li>
          <li>
            <a href="#" className="block rounded-lg hover:bg-gray-100  px-4 py-2 text-sm font-medium text-gray-700">
              Profile
            </a>
          </li>
          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium"> Account </span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <ul className="mt-2 space-y-1 px-4 ">
                {user.role === 'admin' && (
                  <li>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full cursor-pointer block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => signOut()}>
                    Logout
                  </button>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}
