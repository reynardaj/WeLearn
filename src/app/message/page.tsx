// app/message/page.tsx
'use client';

import MessagePageTutee from '@/components/MessageComponents/MessagePageTutee';
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MessagePageTutee />
      </Suspense>
    </div>
  )
}
