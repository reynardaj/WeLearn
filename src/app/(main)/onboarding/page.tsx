'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

export default function OnboardingComponent() {
  const [error, setError] = React.useState('')
  const { user } = useUser()
  const router = useRouter()

  const handleSubmit = async (role: 'mentor' | 'mentee') => {
    const formData = new FormData()
    formData.append('role', role)
    
    const res = await completeOnboarding(formData)
    if (res?.message) {
      await user?.reload()
      router.push(role === 'mentor' ? '/mentor-dashboard' : '/mentee-dashboard')
    }
    if (res?.error) {
      setError(res?.error)
    }
  }

  return (
    <div>
      <h1>Choose Your Role</h1>
      <div>
        <button onClick={() => handleSubmit('mentor')}>
          I'm a Mentor
        </button>
        <button onClick={() => handleSubmit('mentee')}>
          I'm a Mentee
        </button>
      </div>
      {error && <p className="text-red-600">Error: {error}</p>}
    </div>
  )
}