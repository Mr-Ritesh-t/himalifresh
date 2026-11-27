'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/forgot-password');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8F0E4] flex items-center justify-center p-4">
      <div className="text-center text-sm text-gray-600">
        Redirecting to password reset...
      </div>
    </div>
  );
}
