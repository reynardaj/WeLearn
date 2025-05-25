'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
        <p className="text-gray-600">
          Thank you for your payment. You'll be redirected to the dashboard shortly.
        </p>
      </div>
    </div>
  );
}
