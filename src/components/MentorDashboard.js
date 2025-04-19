// components/MentorDashboard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';

const MentorDashboard = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.publicMetadata?.role !== 'Mentor') {
      router.push('/');
    }
  }, [user, router]);

  return <p>Welcome to the Mentor Dashboard</p>;
};

export default MentorDashboard;
