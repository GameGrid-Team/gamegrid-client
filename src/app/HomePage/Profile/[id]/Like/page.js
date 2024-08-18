'use client'
import Posts from '@/app/components/posts'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ProfileLike({ params }) {
  const [userData, setUserData] = useState()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://gamegrid-server.onrender.com/api/users/${params.id}/data`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()

        if (response.ok) {
          setUserData(data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      <Head>
        <title>Profile</title>
      </Head>

      {/* User Data Section */}
      <div className="w-full max-w-md bg-primary shadow-md rounded-lg p-6 mb-8">
        <Image
          src={userData.avatar}
          alt="User Avatar"
          width={100000000000}
          height={100000000000}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-bold">{userData.nickname}</h3>
      </div>
      <h3 className="font-bold text-2xl">Liked Posts</h3>

      {/* Posts Section */}
      <div className="w-full max-w-2xl">
        <Posts keyPost={'MyLiked'} />
      </div>
    </div>
  )
}
