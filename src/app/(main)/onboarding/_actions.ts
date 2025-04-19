'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export const completeOnboarding = async (role: 'mentor' | 'mentee') => {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'No Logged In User' }
  }

  try {
    const client = await clerkClient()
    const res = await client.users.updateUserMetadata(userId, {
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