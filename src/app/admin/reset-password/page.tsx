'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminResetPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/forgot-password');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#073D2B] flex items-center justify-center p-4">
      <div className="text-center text-sm text-emerald-100">
        Redirecting to administrator password reset...
      </div>
    </div>
  );
}
