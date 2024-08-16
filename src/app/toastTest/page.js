'use client'
import React from 'react'
import { Toaster, toast } from 'sonner'

const TestPage = () => {
  return (
    <div>
      <Toaster />
      <button onClick={() => toast('Noder Neder')}>Give me a toast</button>
    </div>
  )
}

export default TestPage
