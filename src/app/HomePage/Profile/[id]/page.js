'use client'
import Posts from '@/app/components/posts'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import FollowButton from '@/app/components/followButton'
import { getSessionData } from '@/app/actions'
import LoadingOverlay from '@/app/components/loading'
import Link from 'next/link'
export default function ProfilePage({ params }) {
  const [userData, setUserData] = useState()
  const [following, setFollowing] = useState([]) // סטייט עבור רשימת העוקבים
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const id = await getSessionData()
      setUserId(id) // Set userId once it is resolved
      try {
        const [userResponse, followingResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/users/${params.id}/data`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch(`http://localhost:3001/api/users/${params.id}/list/following`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        ])

        const userData = await userResponse.json()
        const followersData = await followingResponse.json()

        if (userResponse.ok) {
          setUserData(userData)
        }
        if (followingResponse.ok) {
          setFollowing(followersData.following_list)
        }
      } catch (error) {
        console.error('Error fetching user data or followers:', error)
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


      <div className="flex w-full justify-between">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center">
          {/* User Data Section */}
          <div className="w-full max-w-md bg-[#16303b] shadow-md rounded-lg p-6 mb-8 relative">
            <Image
              src={userData.avatar}
              alt="User Avatar"
              width={1000000000000}
              height={100000000000}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
    
            <div className="p-6 max-w-lg mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4 -mt-6">{userData.nickname}</h3>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Image
                    src={userData.social.rank.rank_image_url}
                    alt="Rank Image"
                    width={100000}
                    height={100000}
                    className="w-20 h-20 rounded-full -mb-5"
                  />
                </div>

                <h3 className="text-xl font-semibold -mt-3">{userData.social.rank.rank_name}</h3>
              </div>
            </div>
            <div className="mt-4 ">
              <p className="text-lg ">{userData.bio}</p>
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

        {/* Following Section - Centered Vertically and Aligned to the Right */}
        <div className=" w-80 bg-secondary shadow-md rounded-lg p-6 mb-8 absolute right-0 top-1/2 transform -translate-y-1/2 mr-4">
          <h3 className="text-xl font-bold mb-4">Following:</h3>
          <ul>
            {following.length > 0 ? (
              following.map((follower) => (
                <li key={follower._id} className="mb-5">
                  <div className="flex items-center">
                    <Link href={`/HomePage/Profile/${follower._id}`}>
                      <Image
                        src={follower.avatar}
                        alt={follower.nickname}
                        width={100000}
                        height={1000000}
                        className="rounded-full mr-2 w-14 h-14"
                      />
                    </Link>
                    <Link href={`/HomePage/Profile/${follower._id}`}>
                      <p className="text-xl font-medium">{follower.nickname}</p>
                    </Link>
                    <div className="pl-10">
                      <FollowButton
                        userId={userId}
                        followId={follower._id}
                        initialIsFollowing={follower.social.followers.includes(userId)}
                      />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>No followers found.</p>
            )}
          </ul>

          {/* Follow Teammate Button */}
          {/* <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Follow Teammate
          </button> */}
        </div>
      </div>
    </div>
  )
}
