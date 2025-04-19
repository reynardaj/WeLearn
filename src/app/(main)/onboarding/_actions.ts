'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export const completeOnboarding = async (role: 'mentor' | 'mentee') => {
  const { userId } = auth()

  if (!userId) {
    return { error: 'No Logged In User' }
  }

  try {
    const res = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    })

    return { message: res.publicMetadata }
  } catch (err) {
    console.error(err)
    return { error: 'There was an error updating the user metadata.' }
  }
}
