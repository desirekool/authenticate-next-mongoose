"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <header className="text-gray-600 body-font w-full mx-auto">
      <div className="mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="flex order-first lg:order-none lg:w-2/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-self-start mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Authenticator App</span>
        </div>
        <nav className="flex lg:w-2/5 flex-wrap items-center justify-self-start text-base md:ml-auto">
          {!session ? (
            <>
              <Link href="/login" className="mr-5 hover:text-gray-900">
                Log in
              </Link>
              <Link href="/signup" className="mr-5 hover:text-gray-900">
                Sign up
              </Link>
            </>
          ) : (
            <>
              {session.user?.email}
              <button
                onClick={() => signOut()}
                className="ml-5 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          )}
        </nav>
        <div className="lg:w-1/5 inline-flex lg:justify-end ml-5 lg:ml-0">
          <Link href="/dashboard" className="mr-5 hover:text-gray-900">
            dashboard
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
