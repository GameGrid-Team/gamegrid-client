'use client'
import Posts from '@/app/components/posts'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import FollowButton from '@/app/components/followButton'
import { getSessionData } from '@/app/actions'
import LoadingOverlay from '@/app/components/loading'

export default function ProfilePage({ params }) {
  const [userData, setUserData] = useState()
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const id = await getSessionData()
      setUserId(id) // Set userId once it is resolved
      try {
        const response = await fetch(`http://localhost:3001/api/users/${params.id}/data`, {
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
    return (
      <div className="flex items-center h-screen ml-96 p-96">
        <LoadingOverlay />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      <Head>
        <title>Profile</title>
      </Head>

      {/* User Data Section */}
      <div className="w-full max-w-md bg-primary shadow-md rounded-lg p-6 mb-8 relative">
        <Image
          src={userData.avatar}
          alt="User Avatar"
          width={1000000000000}
          height={100000000000}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-bold text-white">
          Nickname: {userData.nickname}
          <div>
            <h3 className="text-xl font-bold">Rank: {userData.social.rank.rank_name}</h3>
          </div>
        </h3>

        <div>
          <Image
            src={userData.social.rank.rank_image_url}
            alt="User Avatar"
            width={10000000000}
            height={1000000000}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        </div>

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
        <div className="absolute top-4 right-4">
          {userId === params.id ? (
            ''
          ) : (
            <FollowButton
              userId={userId}
              followId={params.id}
              initialIsFollowing={userData.social.followers.includes(userId)}
            />
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="w-full max-w-2xl">
        <Posts keyPost={params.id} />
      </div>
    </div>
  )
}
