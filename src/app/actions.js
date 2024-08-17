'use server'

import { cookies } from 'next/headers'

export async function loginbtn(sessionData) {
  const encryptedSessionData = sessionData
  cookies().set('session', encryptedSessionData, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function logoutbtn() {
  cookies().delete('session', { path: '/' })
}

export async function getSessionData() {
  const encryptedSessionData = cookies().get('session')?.value
  return encryptedSessionData ? encryptedSessionData : null
}

export async function sendNotification(userId, clickedId, notType) {
  const response = await fetch(
    `http://localhost:3001/api/users/${userId}/${clickedId}/notification/${notType}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  const data = await response.json()
  console.log('sssssssssssss')
  return
}
