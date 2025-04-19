'use client'
import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

export default function RoleSelector() {
  const [error, setError] = React.useState('')
  const { user } = useUser()
  const router = useRouter()

  const handleRoleSelect = async (role: 'mentor' | 'mentee') => {
    const res = await completeOnboarding(role)
    if (res?.message) {
      await user?.reload()
      router.push(role === 'mentor' ? '/mentor-dashboard' : '/mentee-dashboard')
    }
    if (res?.error) {
      setError(res?.error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Choose Your Role</h1>
      <div className="flex gap-4">
        <button
          className="px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-100 transition"
          onClick={() => handleRoleSelect('mentor')}
        >
          I'm a Mentor
        </button>
        <button
          className="px-6 py-3 border border-green-600 rounded-lg text-green-600 hover:bg-green-100 transition"
          onClick={() => handleRoleSelect('mentee')}
        >
          I'm a Mentee
        </button>
      </div>
      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
    </div>
  )
}
