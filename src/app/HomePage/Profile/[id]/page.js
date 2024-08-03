'use client'
import Posts from '@/app/components/posts'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ProfilePage({ params }) {
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
          width={24}
          height={24}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-bold">Nickname: {userData.nickname}</h3>

        {/* Rank progress gauge section */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-center mb-2">Rank Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(userData.social.rank.exp / userData.social.rank.next_rank) * 100}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">
            {userData.social.rank.exp} / {userData.social.rank.next_rank}
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="w-full max-w-2xl">
        <Posts keyPost={'MyPost'} />
      </div>
    </div>
  )
}
