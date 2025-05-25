'use client';

import { useState } from 'react';

interface PaymentButtonProps {
  amount: number;
  description: string;
  buttonText?: string;
  className?: string;
}

export default function PaymentButton({ amount, description, buttonText = 'Pay Now', className = '' }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/xendit/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const data = await response.json();
      
      if (!data.invoice_url) {
        throw new Error('Invalid response from payment provider');
      }
      
      // Redirect to Xendit payment page
      window.location.href = data.invoice_url;
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your payment';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 w-full max-w-xs ${className}`}
        aria-busy={isLoading}
        aria-live="polite"
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
      {error && (
        <p className="text-red-500 mt-2 text-sm text-center">
          {error}
        </p>
      )}
    </div>
  );
}
