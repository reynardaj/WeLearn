"use client";
import { Heading3, Heading4 } from "@/components/Heading";
import { TextMd } from "@/components/Text";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubscriptionSuccess() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorIdAndMarkPro = async () => {
      try {
        // Step 1: Get user ID
        const userIdResponse = await fetch('/api/get-user-id');
        if (!userIdResponse.ok) {
          throw new Error('Failed to get user ID');
        }
        const { userId } = await userIdResponse.json();

        if (!userId) {
          throw new Error('No user ID found');
        }
        // Step 2: Get tutor ID using user ID
        const tutorResponse = await fetch(`/api/users/tutor/${userId}`);
        if (!tutorResponse.ok) {
          throw new Error('Failed to get tutor ID');
        }
        const { tutorId } = await tutorResponse.json();
        
        if (!tutorId) {
          throw new Error('No tutor ID found');
        }
        
        // Step 3: Mark tutor as pro
        const subscriptionResponse = await fetch('/api/subscription-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tutorId: tutorId }),
        });

        if (!subscriptionResponse.ok) {
          throw new Error('Failed to mark tutor as pro');
        }

        // Success! Update UI
        setLoading(false);
      } catch (err) {
        console.error('Error in subscription process:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchTutorIdAndMarkPro();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <Heading3 className="text-gray-900 mb-2">Processing Subscription...</Heading3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <Heading3 className="text-gray-900 mb-4">Error</Heading3>
          <TextMd className="text-gray-600 mb-6">{error}</TextMd>
          <button
            onClick={() => router.push("/dashboard/tutor")}
            className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-primary text-6xl mb-4">✓</div>
          <Heading3 className="text-text mb-2">
            Subscription Successful!
          </Heading3>
          <TextMd className="text-text">
            Thank you for subscribing to WeLearn Premium. Your subscription is
            now active.
          </TextMd>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <Heading4 className="pb-4">Subscription Details</Heading4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <TextMd>Plan:</TextMd>
              <TextMd>Pro Tutor</TextMd>
            </div>
            <div className="flex justify-between">
              <TextMd>Price:</TextMd>
              <TextMd>Rp 50,000</TextMd>
            </div>
            <div className="flex justify-between">
              <TextMd>Status:</TextMd>
              <TextMd className="text-primary">Active</TextMd>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/tutor")}
            className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
