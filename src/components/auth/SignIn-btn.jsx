'use client';

import Link from 'next/link';

const SignIn = () => {
  return (
    <div className="flex items-center justify-center text-gray-600 font-semibold">
      <Link href="/signin">Sign in</Link>
    </div>
  );
};

export default SignIn;
